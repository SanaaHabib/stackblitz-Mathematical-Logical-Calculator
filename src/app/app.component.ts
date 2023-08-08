import { Component, OnInit } from '@angular/core';
import Operators from '../operators';
import { evaluate } from 'mathjs';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  operatorlist = [];
  expression: string = '';
  numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  currentOp: any;
  currentNum: any;
  currentNumberList = [];
  result: any;
  isVisible: boolean;
  constructor(private op: Operators) {}
  ngOnInit() {
    this.op.data.subscribe((res) => {
      this.operatorlist = res;
      console.log(res);
    });
  }
  Onoperate(op) {
    console.log('op', op);
    this.currentOp = op;
    if (this.currentOp.argument == '~') {
      this.currentNumberList = [];
    }
    this.expression =
      this.currentOp.argument == 1
        ? this.expression + this.currentOp.operator
        : this.currentOp.argument == 'x'
        ? this.expression + this.currentOp.operator
        : this.currentOp.argument == 2
        ? this.expression + this.currentOp.operator
        : this.expression
        ? this.expression + this.currentOp.symbol
        : this.currentOp.symbol;
  }

  OnNumber(num) {
    console.log('num typeof', num);
    this.currentNum = num;
    this.currentNumberList?.push(num);
    var regExp = /(\([^()]*\))[^()]*$/;
    console.log('currentNumberList', this.currentNumberList);

    if (this.currentOp?.argument == 1) {
      this.expression = this.expression
        ? this.expression.includes('number')
          ? this.expression?.replace('number', this.currentNumberList.join(''))
          : this.expression.slice(
              0,
              this.expression?.length - this.currentNumberList?.length
            ) +
            this.currentNumberList.join('') +
            ')'
        : this.currentOp.operator.replace(
            'number',
            this.currentNumberList.join('')
          );
    } else if (this.currentOp?.argument == 'x') {
      this.expression = this.expression
        ? this.expression.includes('...numbers')
          ? this.expression?.replace(
              '...numbers',
              this.currentNumberList.join(',')
            )
          : this.expression.replace(this.expression?.match(/\((.*)\)/).pop(), this.currentNumberList.join(','))
        : this.expression.replace(
            '...numbers',
            this.currentNumberList.join(',')
          );
    } else if (this.currentOp?.argument == 2) {
      if (this.expression.includes('number')) {
        this.expression = this.expression.replace('number', num);
      } else {
        this.expression = this.expression.replace('power', num);
      }

      if (this.expression.includes('maxNumber')) {
        this.expression = this.expression.replace('maxNumber', num);
      } else {
        this.expression = this.expression.replace('minNumber', num);
      }
    } else {
      this.expression = this.expression ? this.expression + num : num;
      this.currentOp = null;
    }
  }
  BackSpace() {
    console.log('');
    this.expression = this.expression.slice(0, this.expression?.length - 1);
  }
  Clear() {
    this.expression = '';
    this.result = null;
    this.currentNum = null;
    this.currentOp = null;
    this.currentNumberList = [];
  }
  sumup() {
    try {
      this.result = evaluate(this.expression).toString();
    } catch (error) {
      this.isVisible = true;
      setTimeout(() => (this.isVisible = false), 2000);
    }
  }
}

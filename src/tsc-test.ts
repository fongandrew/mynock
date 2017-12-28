import * as Sinon from 'sinon';
import wrap, { callee } from './index';

function add(a: number, b: number) {
  return a + b;
}

// Wrapped function
wrap(add)(1, 2);

// Wrapped and named function
wrap(add, 'add')(1, 2);

// Wrapped class
class MyCls {
  public a: number;
  public b: number;

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  add() {
    return this.a + this.b;
  }
}
const WrappedCls = wrap(MyCls);
(new WrappedCls(1, 2)).add();

// Stubbing
Sinon.stub(WrappedCls, callee as any)
  .callsFake(
    function constructor(this: MyCls, a: number, b: number) {
      this.a = a + 1;
      this.b = b + 2;
    }
  );

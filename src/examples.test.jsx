import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { callee } from './index';
import {
  add,
  MyCls,
  StatelessComponent,
  StatelessComponent2,
  MyComponent,
  MyComponent2,
  MyComponent3,
} from './examples';

// Tape is Node-specific, use 'require' rather than import
const tape = require('tape');

// Create Sinon sandbox for stubbing
const sandbox = sinon.sandbox.create();

// Wrap test function with setup / teardown
const test = (name, cb) => {
  tape(name, (t) => {
    // Setup

    // Test
    cb(t);

    // Teardown
    sandbox.restore();
  });
};

test('wrap simple function', (t) => {
  t.equal(add(1, 2), 3, 'preserves original return value');
  t.equal(add.name, 'add', 'allows specification of name');
  t.end();
});

test('simple wrap spy', (t) => {
  const spy = sandbox.spy(add, callee);
  t.equal(
    add(1, 2),
    3,
    'returns original function value',
  );
  sinon.assert.calledWith(spy, 1, 2);
  t.end();
});

test('simple stub spy', (t) => {
  const stub = sandbox.stub(add, callee).callsFake((a, b) => a * b);
  t.equal(
    add(1, 2),
    2,
    'returns stubbed function value',
  );
  sinon.assert.calledWith(stub, 1, 2);
  t.end();
});

test('class constructor spy', (t) => {
  const spy = sandbox.spy(MyCls, callee);
  const cls = new MyCls(1, 2);
  sinon.assert.calledWith(spy, 1, 2);
  t.equal(cls.add(), 3, 'uses original class methods');
  t.end();
});

test('class constructor stub', (t) => {
  const stub = sandbox.stub(MyCls, callee)
    .callsFake(function constructor(a, b) {
      this.a = a + 1;
      this.b = b + 2;
    });
  const cls = new MyCls(1, 2);

  sinon.assert.calledWith(stub, 1, 2);
  t.equal(cls.add(), 6, 'uses stubbed method');
  t.end();
});

test('stateless React component with statics assigned after wrap', (t) => {
  t.equal(
    StatelessComponent.displayName,
    'My Stateless Component',
    'uses displayName',
  );
  const wrapper = shallow(<StatelessComponent />);
  t.equal(wrapper.text(), 'Hello World', 'uses defaultProps');
  t.end();
});

test('stateless React component with statics assigned before wrap', (t) => {
  t.equal(
    StatelessComponent2.displayName,
    'My Other Stateless Component',
    'uses displayName',
  );
  const wrapper = shallow(<StatelessComponent2 />);
  t.equal(wrapper.text(), 'Hello World', 'uses defaultProps');
  t.end();
});

test('class-based React component with statics assigned after wrap', (t) => {
  t.equal(MyComponent.displayName, 'My Component', 'uses displayName');
  const wrapper = shallow(<MyComponent />);
  t.equal(wrapper.text(), 'Hello World', 'uses defaultProps');
  t.end();
});

test('class-based React component with statics assigned before wrap', (t) => {
  t.equal(MyComponent2.displayName, 'My Other Component', 'uses displayName');
  const wrapper = shallow(<MyComponent2 />);
  t.equal(wrapper.text(), 'Hello World', 'uses defaultProps');
  t.end();
});

test('React component class with stubbed constructor', (t) => {
  const stub = sandbox.stub(MyComponent3, callee)
    .callsFake(function constructor(props) {
      React.Component.call(this, props);
      this.state = {
        prefix: '¡',
        suffix: '!',
      };
    });
  const wrapper = shallow(<MyComponent3 content="hola" />);
  sinon.assert.calledWith(stub, { content: 'hola' });
  t.equal(wrapper.text(), '¡hola!', 'uses stubbed constructor');
  t.end();
});

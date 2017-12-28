import React from 'react';
import PropTypes from 'prop-types';
import wrap from './index';

// Simple export test
export const add = wrap((a, b) => a + b, 'add');

// Test class export
export const MyCls = wrap(class MyCls {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  add() {
    return this.a + this.b;
  }
});

// Stateless React component with prop-types *after* wrapping
export const StatelessComponent = wrap(({ a, b }) => (
  <div>
    {a} {b}
  </div>
));

StatelessComponent.displayName = 'My Stateless Component';
StatelessComponent.defaultProps = {
  a: PropTypes.string,
  b: PropTypes.string,
};
StatelessComponent.defaultProps = {
  a: 'Hello',
  b: 'World',
};

// Stateless React component with prop-types *before* wrapping
const BaseStatelessComponent2 = ({ a, b }) => (
  <div>
    {a} {b}
  </div>
);

BaseStatelessComponent2.displayName = 'My Other Stateless Component';
BaseStatelessComponent2.propTypes = {
  a: PropTypes.string,
  b: PropTypes.string,
};
BaseStatelessComponent2.defaultProps = {
  a: 'Hello',
  b: 'World',
};

export const StatelessComponent2 = wrap(BaseStatelessComponent2);

// Class-based React component with prop-types *after* wrapping
export const MyComponent = wrap(class MyComponent extends React.Component {
  render() {
    const { a, b } = this.props; // eslint-disable-line react/prop-types
    return (
      <div>
        {a} {b}
      </div>
    );
  }
});

MyComponent.propTypes = {
  a: PropTypes.string,
  b: PropTypes.string,
};
MyComponent.defaultProps = {
  a: 'Hello',
  b: 'World',
};
MyComponent.displayName = 'My Component';

// Class-based React component with prop-types *before* wrapping
class BaseMyComponent2 extends React.Component {
  render() {
    const { a, b } = this.props;
    return (
      <div>
        {a} {b}
      </div>
    );
  }
}

BaseMyComponent2.propTypes = {
  a: PropTypes.string,
  b: PropTypes.string,
};
BaseMyComponent2.defaultProps = {
  a: 'Hello',
  b: 'World',
};
BaseMyComponent2.displayName = 'My Other Component';

export const MyComponent2 = wrap(BaseMyComponent2);


// React component with a constructor and state
class BaseMyComponent3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: '',
      suffix: '',
    };
  }

  render() {
    const { prefix, suffix } = this.state;
    const { content } = this.props;
    return (
      <div>
        { prefix }{ content }{ suffix }
      </div>
    );
  }
}

BaseMyComponent3.propTypes = {
  content: PropTypes.string.isRequired,
};

export const MyComponent3 = wrap(BaseMyComponent3);

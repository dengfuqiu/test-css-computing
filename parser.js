const css = require('css');

const EOF = Symbol('EOF');

let currentToken = null;

let currentAttribute = null;

let stack = [{
  type: 'document',
  children: []
}];
let currentTextNode = null;

let rules = [];
function addCSSRules(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.chartAt(0) === '#') {
    let attr = element.attributes.filter(attr => attr.name === 'id')[0];
    if (attr && attr.value === selector.replace('#', '')) {
      return true;
    } else if (selector.chartAt(0) === '.') {
      let attr = element.attributes.filter(attr => attr.name === 'class')[0];
      if (attr && attr.value === selector.replace('.', '')) {
        return true;
      } else {
        if (element.tagName === selector) {
          return true;
        }
      }
    }
  }
}

function specificity(selector) {
  const p = [0, 0, 0, 0];
  const selectorParts = selector.split(' ');
  for (const part of selectorParts) {
    if (part.chartAt(0) === '#') {
      p[1] += 1;
    } else if (part.chartAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

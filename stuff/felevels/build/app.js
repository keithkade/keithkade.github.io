'use strict';

// npx babel --watch stuff/felevels/src --out-dir stuff/felevels/build --presets react-app/prod

/* TODO
Display actual level (w/ promote)
Auto promote level 20
Shorten slider if promoted
Shorten slider on level
Special styling when capped
Overall styling
Support for growths more than 100%
Get more real data
Character picker
Game picker
Make promote a toggle
*/

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _React = React,
    useState = _React.useState;


var oswinData = {
  name: 'Oswin',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/img/compressed/felevels/fe7/Oswin.png',
  startLvl: 9,
  attributes: [{ name: 'HP', base: 28, growth: .9, cap: [60, 60], promote: 4 }, { name: 'Str', base: 13, growth: .4, cap: [20, 29], promote: 2 }, { name: 'Skl', base: 9, growth: .3, cap: [20, 27], promote: 2 }, { name: 'Spd', base: 5, growth: .3, cap: [20, 24], promote: 3 }, { name: 'Lck', base: 3, growth: .35, cap: [30, 30], promote: 2 }, { name: 'Def', base: 13, growth: .55, cap: [20, 30], promote: 3 }, { name: 'Res', base: 3, growth: .30, cap: [20, 25], promote: 1 }]
};

var round = function round(num) {
  return Math.round(num * 100) / 100;
};

var levelUp = function levelUp(attributes, promoted) {
  return attributes.map(function (attr) {
    var cap = attr.cap[promoted ? 1 : 0];
    return Object.assign({}, attr, {
      avg: Math.min(cap, round(attr.avg + attr.growth)),
      current: Math.min(cap, Math.random() < attr.growth ? attr.current + 1 : attr.current)
    });
  });
};

var levelDown = function levelDown(attributes, promoted) {
  return attributes.map(function (attr) {
    var cap = attr.cap[promoted ? 1 : 0];
    return Object.assign({}, attr, {
      avg: Math.min(cap, round(attr.avg - attr.growth)),
      current: Math.min(cap, Math.random() < attr.growth ? attr.current - 1 : attr.current)
    });
  });
};

var promote = function promote(attributes) {
  return attributes.map(function (attr) {
    return Object.assign({}, attr, {
      avg: attr.avg + attr.promote,
      current: attr.current + attr.promote
    });
  });
};

var unpromote = function unpromote(attributes) {
  return attributes.map(function (attr) {
    return Object.assign({}, attr, {
      avg: attr.avg - attr.promote,
      current: attr.current - attr.promote
    });
  });
};

var Attribute = function Attribute(_ref) {
  var attr = _ref.attr,
      setVal = _ref.setVal;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'span',
      { className: 'attr__name' },
      attr.name,
      ':'
    ),
    React.createElement('input', { className: 'attr__input', type: 'text', value: attr.current, onChange: function onChange(e) {
        return setVal(parseInt(e.target.value));
      } }),
    React.createElement(
      'span',
      { className: 'attr__avg' },
      'Avg: ',
      attr.avg
    ),
    React.createElement(
      'span',
      { className: 'attr__growth' },
      'Growth: ',
      attr.growth
    )
  );
};

var Character = function Character(_ref2) {
  var character = _ref2.character;

  var initialStats = character.attributes.map(function (attr) {
    return Object.assign({}, attr, { current: attr.base, avg: attr.base });
  });

  var _useState = useState(initialStats),
      _useState2 = _slicedToArray(_useState, 2),
      stats = _useState2[0],
      setStats = _useState2[1];

  var _useState3 = useState(character.promoted),
      _useState4 = _slicedToArray(_useState3, 2),
      promoted = _useState4[0],
      setPromoted = _useState4[1];

  var _useState5 = useState(character.startLvl),
      _useState6 = _slicedToArray(_useState5, 2),
      lvl = _useState6[0],
      setLvl = _useState6[1];

  var handleLvlChange = function handleLvlChange(oldLvl, newLvl) {
    var diff = newLvl - oldLvl;
    var newStats = stats;
    for (var i = 0; i < Math.abs(diff); i++) {
      if (newLvl > lvl) {
        newStats = levelUp(newStats, promoted);
      } else {
        newStats = levelDown(newStats, promoted);
      }
    }
    // 20 -> 21 promote
    if (lvl < 21 && newLvl > 20) {
      setPromoted(true);
      newStats = promote(newStats);
    }
    // 21 -> 20 unpromote
    if (lvl > 20 && newLvl < 21) {
      setPromoted(false);
      newStats = unpromote(newStats);
    }
    setStats(newStats);
    setLvl(newLvl);
  };

  return React.createElement(
    'div',
    { className: 'character' },
    React.createElement(
      'div',
      { className: 'character__info' },
      React.createElement(
        'h3',
        null,
        character.name
      ),
      React.createElement(
        'div',
        null,
        'Class: ',
        character.class[0],
        ' \u2192 ',
        character.class[1]
      ),
      React.createElement(
        'div',
        null,
        'Level: ',
        lvl
      )
    ),
    React.createElement(
      'div',
      { className: 'character__stats' },
      stats.map(function (attr, i) {
        return React.createElement(Attribute, {
          key: attr.name,
          attr: attr,
          setVal: function setVal(val) {
            var newStats = [].concat(_toConsumableArray(stats));
            newStats[i].current = val;
            setStats(newStats);
          }
        });
      }),
      React.createElement(
        'button',
        {
          onClick: function onClick() {
            handleLvlChange(lvl, lvl - 1);
          } },
        'Down'
      ),
      React.createElement('input', { type: 'range', min: 1, max: 39, value: lvl, className: 'slider',
        onChange: function onChange(e) {
          var newLvl = e.target.value;
          handleLvlChange(lvl, newLvl);
        }
      }),
      React.createElement(
        'button',
        {
          onClick: function onClick() {
            handleLvlChange(lvl, lvl + 1);
          } },
        'Up'
      ),
      React.createElement('input', { type: 'checkbox',
        checked: promoted,
        onChange: function onChange(cb) {
          setPromoted(cb.target.checked);
          if (cb.target.checked) {
            setStats(promote(stats));
          } else {
            setStats(unpromote(stats));
          }
        }
      }),
      'Promote'
    ),
    React.createElement('img', { className: 'character__img', src: character.img })
  );
};

var App = function App() {
  var _useState7 = useState(0),
      _useState8 = _slicedToArray(_useState7, 2),
      count = _useState8[0],
      setCount = _useState8[1];

  return React.createElement(
    'div',
    null,
    React.createElement(Character, { character: oswinData })
  );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
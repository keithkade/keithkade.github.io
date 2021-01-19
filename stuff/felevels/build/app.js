'use strict';

// npx babel --watch stuff/felevels/src --out-dir stuff/felevels/build --presets react-app/prod

/* TODO
Basic Instructions
Overall styling
Two characters (Get real Lyn info)
Make it work-ish on mobile
==== AFTER POST FOR FEEDBACK ====
Support for growths more than 100%
Get more real data
Character picker
Game picker
Make promote a toggle
*/

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _React = React,
    useState = _React.useState,
    useEffect = _React.useEffect;


var oswinData = {
  name: 'Oswin',
  id: 'oswin',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/img/compressed/felevels/fe7/Oswin.png',
  startLvl: 9,
  attributes: [{ name: 'HP', base: 28, growth: .9, cap: [60, 60], promote: 4 }, { name: 'Str', base: 13, growth: .4, cap: [20, 29], promote: 2 }, { name: 'Skl', base: 9, growth: .3, cap: [20, 27], promote: 2 }, { name: 'Spd', base: 5, growth: .3, cap: [20, 24], promote: 3 }, { name: 'Lck', base: 3, growth: .35, cap: [30, 30], promote: 2 }, { name: 'Def', base: 13, growth: .55, cap: [20, 30], promote: 3 }, { name: 'Res', base: 3, growth: .30, cap: [20, 25], promote: 1 }]
};

var lynData = {
  name: 'Lyn',
  id: 'lyn',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/img/compressed/felevels/fe7/Lyn.png',
  startLvl: 9,
  attributes: [{ name: 'HP', base: 28, growth: .9, cap: [60, 60], promote: 4 }, { name: 'Str', base: 13, growth: .4, cap: [20, 29], promote: 2 }, { name: 'Skl', base: 9, growth: .3, cap: [20, 27], promote: 2 }, { name: 'Spd', base: 5, growth: .3, cap: [20, 24], promote: 3 }, { name: 'Lck', base: 3, growth: .35, cap: [30, 30], promote: 2 }, { name: 'Def', base: 13, growth: .55, cap: [20, 30], promote: 3 }, { name: 'Res', base: 3, growth: .30, cap: [20, 25], promote: 1 }]
};

var characterData = {
  oswin: oswinData,
  lyn: lynData
};

var MAX_LVL = 39;
var MIN_LVL = 1;

var round = function round(num) {
  return Number(num.toFixed(3));
};

var levelUpAttributes = function levelUpAttributes(attributes, promoted) {
  return attributes.map(function (attr) {
    var cap = attr.cap[promoted ? 1 : 0];
    return Object.assign({}, attr, {
      avg: Math.min(cap, round(attr.avg + attr.growth)),
      current: Math.min(cap, Math.random() < attr.growth ? attr.current + 1 : attr.current)
    });
  });
};

var levelDownAttributes = function levelDownAttributes(attributes, promoted) {
  return attributes.map(function (attr) {
    var cap = attr.cap[promoted ? 1 : 0];
    return Object.assign({}, attr, {
      avg: Math.min(cap, round(attr.avg - attr.growth)),
      current: Math.min(cap, Math.random() < attr.growth ? attr.current - 1 : attr.current)
    });
  });
};

var promoteStats = function promoteStats(attributes) {
  return attributes.map(function (attr) {
    return Object.assign({}, attr, {
      avg: round(attr.avg + attr.promote),
      current: attr.current + attr.promote
    });
  });
};

var unpromoteStats = function unpromoteStats(attributes) {
  return attributes.map(function (attr) {
    return Object.assign({}, attr, {
      avg: round(attr.avg - attr.promote),
      current: attr.current - attr.promote
    });
  });
};

var Attribute = function Attribute(_ref) {
  var attr = _ref.attr,
      setVal = _ref.setVal,
      promoted = _ref.promoted;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'span',
      { className: 'attr__name' },
      attr.name,
      ':'
    ),
    React.createElement(
      'span',
      { className: 'attr__input' },
      React.createElement('input', { className: 'attr__input-form ' + (attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : ''), type: 'number', value: attr.current, onChange: function onChange(e) {
          return setVal(parseInt(e.target.value));
        } })
    ),
    React.createElement(
      'span',
      { className: 'attr__avg' },
      attr.avg
    ),
    React.createElement(
      'span',
      { className: 'attr__growth' },
      attr.growth
    ),
    React.createElement(
      'span',
      { className: 'attr__cap ' + (attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : '') },
      attr.cap[promoted ? 1 : 0]
    )
  );
};

var Character = function Character(_ref2) {
  var character = _ref2.character,
      reset = _ref2.reset;

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

  // the level at which we chose to promote


  var _useState5 = useState(20),
      _useState6 = _slicedToArray(_useState5, 2),
      lvlPromotedAt = _useState6[0],
      setLvlPromotedAt = _useState6[1];

  // unpromoted levels + promoted levels


  var _useState7 = useState(character.startLvl),
      _useState8 = _slicedToArray(_useState7, 2),
      lvl = _useState8[0],
      setLvl = _useState8[1];

  // level after taking account whether or not the user is promoted


  var _useState9 = useState(character.startLvl),
      _useState10 = _slicedToArray(_useState9, 2),
      displayLvl = _useState10[0],
      setDisplayLvl = _useState10[1];

  var handleLvlChange = function handleLvlChange(oldLvl, newLvl) {
    var diff = newLvl - oldLvl;
    var newStats = stats;
    for (var i = 0; i < Math.abs(diff); i++) {
      if (newLvl > lvl) {
        newStats = levelUpAttributes(newStats, promoted);
      } else {
        newStats = levelDownAttributes(newStats, promoted);
      }
    }
    setLvl(newLvl);
    // 20 -> 21 promote if not already
    if (lvl < 21 && newLvl > 20 && !promoted) {
      setPromoted(true);
      setLvlPromotedAt(20);
      newStats = promoteStats(newStats);
    }
    // 21 -> 20 unpromote
    if (lvl > 20 && newLvl < 21) {
      setPromoted(false);
      newStats = unpromoteStats(newStats);
    }
    setStats(newStats);
  };

  // handle calculating the "display level" based on when we promoted
  useEffect(function () {
    if (promoted) {
      setDisplayLvl(lvl - lvlPromotedAt + 1);
    } else {
      setDisplayLvl(lvl);
    }
  }, [lvl, promoted]);

  // if the user de-promotes and the new level is invalid, set us to the lvl promoted at
  useEffect(function () {
    if (!promoted && lvl > 20) {
      console.log('DEPROMOTED AT LEVEL', lvl);
      handleLvlChange(lvl, lvlPromotedAt);
    }
  }, [promoted]);

  return React.createElement(
    'div',
    { className: 'character' },
    React.createElement(
      'div',
      { className: 'character__info' },
      React.createElement(
        'div',
        { className: 'character__img-wrapper' },
        React.createElement('img', { className: 'character__img', src: character.img })
      ),
      React.createElement(
        'div',
        { className: 'character__desc' },
        React.createElement(
          'h1',
          { className: 'character__name' },
          character.name
        ),
        React.createElement(
          'div',
          { className: 'character__lvl' },
          'Current Level: ',
          React.createElement(
            'span',
            { className: 'character__lvl-data' },
            displayLvl
          )
        ),
        React.createElement(
          'div',
          null,
          'Class: ',
          React.createElement(
            'span',
            { className: promoted ? '' : 'bold' },
            character.class[0]
          ),
          ' \u2192 ',
          React.createElement(
            'span',
            { className: promoted ? 'bold' : '' },
            character.class[1]
          )
        ),
        React.createElement(
          'div',
          null,
          'Total Levels: ',
          lvl,
          ' (before promotion + after promotion)'
        ),
        React.createElement(
          'div',
          null,
          'Promoted at level: ',
          promoted ? lvlPromotedAt : 'NA'
        ),
        React.createElement(
          'button',
          { className: 'character__reset', onClick: reset },
          '\u2190 Back to character select'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'character__stats' },
      React.createElement('span', { className: 'attr__name' }),
      React.createElement(
        'span',
        { className: 'attr__input attr__header' },
        'Current'
      ),
      React.createElement(
        'span',
        { className: 'attr__avg attr__header' },
        'Average for level'
      ),
      React.createElement(
        'span',
        { className: 'attr__growth attr__header' },
        'Growth chance'
      ),
      React.createElement(
        'span',
        { className: 'attr__cap attr__header' },
        'Stat Cap'
      ),
      stats.map(function (attr, i) {
        return React.createElement(Attribute, {
          key: attr.name,
          attr: attr,
          promoted: promoted,
          setVal: function setVal(val) {
            var newStats = [].concat(_toConsumableArray(stats));
            newStats[i].current = val;
            setStats(newStats);
          }
        });
      }),
      React.createElement(
        'div',
        { className: 'level_controls' },
        React.createElement(
          'button',
          {
            className: 'level_btn',
            disabled: lvl === MIN_LVL,
            onClick: function onClick() {
              handleLvlChange(lvl, lvl - 1);
            } },
          '-1'
        ),
        React.createElement('input', { style: { width: (19 + lvlPromotedAt) / 1.5 + 'rem' }, type: 'range', min: 1, max: 19 + lvlPromotedAt, value: lvl, className: 'slider',
          onChange: function onChange(e) {
            var newLvl = Number(e.target.value);
            handleLvlChange(lvl, newLvl);
          }
        }),
        React.createElement(
          'button',
          {
            className: 'level_btn',
            disabled: lvl === MAX_LVL,
            onClick: function onClick() {
              handleLvlChange(lvl, lvl + 1);
            } },
          '+1'
        )
      ),
      React.createElement(
        'div',
        { className: 'promote-container' },
        React.createElement('input', { type: 'checkbox',
          checked: promoted,
          onChange: function onChange(cb) {
            setPromoted(cb.target.checked);
            if (cb.target.checked) {
              setStats(promoteStats(stats));
              setLvlPromotedAt(lvl);
            } else {
              setStats(unpromoteStats(stats));
              setLvlPromotedAt(20);
            }
          }
        }),
        'Promote'
      )
    )
  );
};

var CharacterSelect = function CharacterSelect(_ref3) {
  var setCharacter = _ref3.setCharacter;
  return React.createElement(
    'div',
    { className: 'foooooo' },
    React.createElement(
      'h1',
      null,
      'Select a character:'
    ),
    React.createElement('img', { className: 'character_select_img', onClick: function onClick() {
        return setCharacter(oswinData.id);
      }, src: oswinData.img }),
    React.createElement('img', { className: 'character_select_img', onClick: function onClick() {
        return setCharacter(lynData.id);
      }, src: lynData.img })
  );
};

var App = function App() {
  var _useState11 = useState('oswin'),
      _useState12 = _slicedToArray(_useState11, 2),
      character = _useState12[0],
      setCharacter = _useState12[1];

  return React.createElement(
    'div',
    null,
    character && React.createElement(Character, { character: characterData[character], reset: function reset() {
        return setCharacter(null);
      } }),
    !character && React.createElement(CharacterSelect, { setCharacter: setCharacter })
  );
};

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
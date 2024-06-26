'use strict'; // npx babel --watch stuff/felevels/src --out-dir stuff/felevels/build

/* TODO
Game Picker
Support for multiple promotion paths
FE6 - stats https://fea.fewiki.net/fea.php?game=6
FE8 - stats http://fea.fewiki.net/fea.php?character=gilliam&game=8e
"Custom" mode ???
Better Styles ???
*/

const {
  useState,
  useRef,
  useEffect
} = React; // 1 "Name,Class,Lv,HP,S/M,Skl,Spd,Lck,Def,Res,Con,Mov,Affin,Weapon ranks"

const CHAR_BASE_STATS = ["Eliwood,Lord,1,18,5,5,7,7,5,0,7,5,, C", "Lowen,Cavalier,2,23,7,5,7,3,7,0,10,7,, D, D", "Marcus,Paladin,1,31,15,15,11,8,10,8,11,8,, A, A,  B", "Rebecca,Archer,1,17,4,5,6,4,3,1,5,5,, D", "Dorcas,Fighter,3,30,7,7,6,3,3,0,14,5,, C", "Bartre,Fighter,2,29,9,5,3,4,4,0,13,5,, D", "Hector,Lord,1,19,7,4,5,3,8,0,13,5,, C", "Oswin,Knight,9,28,13,9,5,3,13,3,14,4,, B", "Serra,Cleric,1,17,2,5,8,6,2,5,4,5,, D", "Matthew,Thief,2,18,4,4,11,2,3,0,7,6,, D", "Guy,Myrmidon,3,21,6,11,11,5,5,0,5,5,, C", "Guy HM,Myrmidon,3,25,8,13,13,5,6,1", "Merlinus,Transporter,5,18,0,4,5,12,5,2,25,0,,–", "Erk,Mage,1,17,5,6,7,3,2,4,5,5,, D", "Priscilla,Troubadour,3,16,6,6,8,7,3,6,4,7,, C", "Lyn,Lord,4,18,5,10,11,5,2,0,5,5,, C", "Wil,Archer,4,21,6,5,6,7,5,1,6,5,, D", "Kent,Cavalier,5,23,8,7,8,4,6,1,9,7,, D, D", "Sain,Cavalier,4,22,9,5,7,5,7,0,9,7,, D, D", "Florina,Pegasus Knight,3,18,6,8,9,8,4,5,4,7,, D", "Raven,Mercenary,5,25,8,11,13,2,5,1,8,5,, C", "Raven HM,Mercenary,5,29,10,13,15,2,6,2", "Lucius,Monk,3,18,7,6,10,2,1,6,6,5,, D", "Canas,Shaman,8,21,10,9,8,7,5,8,7,5,, B", "Dart,Pirate,8,34,12,8,8,3,6,1,10,5,, B", "Fiora,Pegasus Knight,7,21,8,11,13,6,6,7,5,7,, C", "Legault,Thief,12,26,8,11,15,10,8,3,9,6,, C", "Legault HM,Thief,12,29,8,13,17,10,8,4", "Ninian,Dancer,1,14,0,0,12,10,5,4,4,5,,–", "Isadora,Paladin,1,28,13,12,16,10,8,6,6,8,, A, B,  D", "Heath,Wyvern Rider,7,28,11,8,7,7,10,1,9,7,, B", "Heath HM,Wyvern Rider,7,32,13,10,9,7,11,2", "Rath,Nomad,9,27,9,10,11,5,8,2,7,7,, B", "Hawkeye,Berserker,4,50,18,14,11,13,14,10,16,6,, A", "Geitz,Warrior,3,40,17,12,13,10,11,3,13,6,, B, B", "Geitz HM,Warrior,3,44,19,13,14,10,12,4", "Wallace,General,1,34,16,9,8,10,19,5,15,5,, A, E", "Farina,Pegasus Knight,12,24,10,13,14,10,10,12,5,7,, A", "Pent,Sage,6,33,18,21,17,14,11,16,8,6,, A, A", "Louise,Sniper,4,28,12,14,17,16,9,12,6,6,, A", "Karel,Swordmaster,8,31,16,23,20,15,13,12,9,6,, A", "Harken,Hero,8,38,21,20,17,12,15,10,11,6,, B, B", "Harken HM,Hero,8,42,23,22,18,12,16,11", "Nino,Mage,5,19,7,8,11,10,4,7,3,5,, C", "Jaffar,Assassin,13,34,19,25,24,10,15,11,8,6,, A", "Vaida,Wyvern Lord,9,43,20,19,13,11,21,6,12,8,, A, A", "Vaida HM,Wyvern Lord,9,47,22,21,14,11,22,7", "Nils,Bard,1,14,0,0,12,10,5,4,4,5,,–", "Karla,Swordmaster,5,29,14,21,18,16,11,12,7,6,, A", "Renault,Bishop,16,43,12,22,20,10,15,18,9,6,, A, A", "Athos,Archsage,20,40,30,24,20,25,20,28,9,6,, S S  S  S"]; // Name,HP,S/M,Skl,Spd,Lck,Def,Res

const CHAR_GROWTH_STATS = ["Eliwood,80,45,50,40,45,30,35", "Lyn,70,40,60,60,55,20,30", "Hector,90,60,45,35,30,50,25", "Sain,80,60,35,40,35,20,20", "Kent,85,40,50,45,20,25,25", "Florina,60,40,50,55,50,15,35", "Wil,75,50,50,40,40,20,25", "Dorcas,80,60,40,20,45,25,15", "Serra,50,50,30,40,60,15,55", "Erk,65,40,40,50,30,20,40", "Rath,80,50,40,50,30,10,25", "Matthew,75,30,40,70,50,25,20", "Wallace,70,45,40,20,30,35,35", "Lowen,90,30,30,30,50,40,30", "Rebecca,60,40,50,60,50,15,30", "Marcus,65,30,50,25,30,15,35", "Bartre,85,50,35,40,30,30,25", "Oswin,90,40,30,30,35,55,30", "Guy,75,30,50,70,45,15,25", "Guy HM,75,30,50,70,45,15,25", "Merlinus,120,0,90,90,100,30,15", "Priscilla,45,40,50,40,65,15,50", "Raven,85,55,40,45,35,25,15", "Raven HM,85,55,40,45,35,25,15", "Lucius,55,60,50,40,20,10,60", "Canas,70,45,40,35,25,25,45", "Dart,70,65,20,60,35,20,15", "Fiora,70,35,60,50,30,20,50", "Legault,60,25,45,60,60,25,25", "Legault HM,60,25,45,60,60,25,25", "Nils,85,5,5,70,80,30,70", "Ninian,85,5,5,70,80,30,70", "Isadora,75,30,35,50,45,20,25", "Heath,80,50,50,45,20,30,20", "Heath HM,80,50,50,45,20,30,20", "Hawkeye,50,40,30,25,40,20,35", "Geitz,85,50,30,40,40,20,20", "Geitz HM,85,50,30,40,40,20,20", "Farina,75,50,40,45,45,25,30", "Pent,50,30,20,40,40,30,35", "Louise,60,40,40,40,30,20,30", "Karel,70,30,50,50,30,10,15", "Harken,80,35,30,40,20,30,25", "Harken HM,80,35,30,40,20,30,25", "Nino,55,50,55,60,45,15,50", "Jaffar,65,15,40,35,20,30,30", "Vaida,60,45,25,40,30,25,15", "Vaida HM,60,45,25,40,30,25,15", "Karla,60,25,45,55,40,10,20", "Renault,60,40,30,35,15,20,40", "Athos,0,0,0,0,0,0,0"];
const CLASSES = {
  "Eliwood": ["Lord", "Knight Lord"],
  "Lowen": ["Cavalier", "Paladin"],
  "Marcus": ["Cavalier", "Paladin"],
  "Rebecca": ["Archer", "Sniper (F)"],
  "Dorcas": ["Fighter", "Warrior"],
  "Bartre": ["Fighter", "Warrior"],
  "Hector": ["Lord", "Great Lord"],
  "Oswin": ["Knight", "General"],
  "Serra": ["Cleric", "Bishop (F)"],
  "Matthew": ["Thief", "Assassin"],
  "Guy": ["Myrmidon", "Swordmaster"],
  "Guy HM": ["Myrmidon", "Swordmaster"],
  "Merlinus": ["Transporter"],
  "Erk": ["Mage", "Sage (M)"],
  "Priscilla": ["Troubadour", "Valkyrie"],
  "Lyn": ["Lord", "Blade Lord"],
  "Wil": ["Archer", "Sniper (M)"],
  "Kent": ["Cavalier", "Paladin"],
  "Sain": ["Cavalier", "Paladin"],
  "Florina": ["Pegasus Knight", "Falcon Knight"],
  "Raven": ["Mercenary", "Hero"],
  "Raven HM": ["Mercenary", "Hero"],
  "Lucius": ["Monk", "Bishop (M)"],
  "Canas": ["Shaman", "Druid"],
  "Dart": ["Pirate", "Berserker"],
  "Fiora": ["Pegasus Knight", "Falcon Knight"],
  "Legault": ["Thief", "Assassin"],
  "Legault HM": ["Thief", "Assassin"],
  "Ninian": ["Dancer"],
  "Isadora": ["Paladin"],
  "Heath": ["Wyvern Rider", "Wyvern Lord"],
  "Heath HM": ["Wyvern Rider", "Wyvern Lord"],
  "Rath": ["Nomad", "Nomad Trooper"],
  "Hawkeye": ["Berserker"],
  "Geitz": ["Warrior"],
  "Geitz HM": ["Warrior"],
  "Wallace": ["General"],
  "Farina": ["Pegasus Knight", "Falcon Knight"],
  "Pent": ["Sage (M)"],
  "Louise": ["Sniper (F)"],
  "Karel": ["Swordmaster"],
  "Harken": ["Hero"],
  "Harken HM": ["Hero"],
  "Nino": ["Mage", "Sage (F)"],
  "Jaffar": ["Assassin"],
  "Vaida": ["Wyvern Lord"],
  "Vaida HM": ["Wyvern Lord"],
  "Nils": ["Bard"],
  "Karla": ["Swordmaster"],
  "Renault": ["Bishop (M)"],
  "Athos": ["Archsage"]
};
const PROMOTION_GAINS = {
  "Blade Lord": [3, 2, 2, 0, 3, 5, 1, 1],
  "Knight Lord": [4, 2, 0, 1, 1, 3, 2, 2],
  "Great Lord": [3, 0, 2, 3, 1, 5, 0, 2],
  "Paladin": [2, 1, 1, 1, 2, 1, 1, 2],
  "General": [4, 2, 2, 3, 2, 3, 1, 2],
  "Hero": [4, 0, 2, 2, 2, 2, 1, 1],
  "Swordmaster": [5, 2, 0, 0, 2, 1, 1, 1],
  "Assassin": [3, 1, 0, 0, 2, 2, 0, 0],
  "Sniper (M)": [3, 1, 2, 2, 2, 3, 1, 1],
  "Sniper (F)": [4, 3, 1, 1, 2, 2, 1, 1],
  "Nomad Trooper": [3, 2, 1, 1, 3, 3, 1, 1],
  "Wyvern Lord": [4, 0, 2, 2, 0, 2, 1, 1],
  "Sage (M)": [4, 1, 0, 0, 3, 3, 1, 1],
  "Sage (F)": [3, 1, 1, 0, 3, 3, 1, 1],
  "Bishop (M)": [3, 2, 1, 0, 3, 2, 1, 1],
  "Bishop (F)": [3, 1, 2, 1, 2, 2, 1, 1],
  "Druid": [4, 0, 0, 3, 2, 2, 1, 1],
  "Warrior": [3, 1, 2, 0, 3, 3, 1, 2],
  "Berserker": [4, 1, 1, 1, 2, 2, 1, 3],
  "Falcon Knight": [5, 2, 0, 0, 2, 2, 1, 1],
  "Valkyrie": [3, 2, 1, 0, 2, 3, 1, 1]
}; // HP	S/M	Skl	Spd	Lck	Def	Res

const STAT_CAPS = {
  "Blade Lord": [60, 24, 29, 30, 30, 22, 22, 25, 15],
  "Knight Lord": [60, 27, 26, 24, 30, 23, 25, 25, 15],
  "Great Lord": [60, 30, 24, 24, 30, 29, 20, 25, 15],
  "Dancer": [60, 10, 10, 30, 30, 24, 26, 20, 15],
  "Bard": [60, 10, 10, 30, 30, 24, 26, 20, 15],
  "Transporter": [60, 20, 20, 20, 30, 20, 20, 25, 15],
  "Paladin": [60, 25, 26, 24, 30, 25, 25, 25, 15],
  "Paladin": [60, 23, 27, 25, 30, 24, 26, 25, 15],
  "General": [60, 29, 27, 24, 30, 30, 25, 20, 15],
  "General": [60, 25, 25, 22, 30, 30, 26, 20, 15],
  "Hero": [60, 25, 30, 26, 30, 25, 22, 20, 15],
  "Hero": [60, 24, 30, 26, 30, 24, 24, 25, 15],
  "Swordmaster": [60, 24, 29, 30, 30, 22, 23, 25, 15],
  "Swordmaster": [60, 22, 29, 30, 30, 22, 25, 25, 15],
  "Assassin": [60, 20, 30, 30, 30, 20, 20, 20, 15],
  "Sniper (M)": [60, 25, 30, 28, 30, 25, 23, 20, 15],
  "Sniper (F)": [60, 24, 30, 29, 30, 24, 24, 20, 15],
  "Nomad Trooper": [60, 25, 28, 30, 30, 24, 23, 20, 15],
  "Wyvern Lord": [60, 27, 25, 23, 30, 28, 22, 25, 15],
  "Sage (M)": [60, 28, 30, 26, 30, 21, 25, 20, 15],
  "Sage (F)": [60, 30, 28, 26, 30, 21, 25, 20, 15],
  "Bishop (M)": [60, 25, 26, 24, 30, 22, 30, 25, 15],
  "Bishop (F)": [60, 25, 25, 26, 30, 21, 30, 25, 15],
  "Druid": [60, 29, 26, 26, 30, 21, 28, 20, 15],
  "Warrior": [60, 30, 28, 26, 30, 26, 22, 20, 15],
  "Berserker": [60, 30, 29, 28, 30, 23, 21, 20, 15],
  "Falcon Knight": [60, 23, 25, 28, 30, 23, 26, 25, 15],
  "Valkyrie": [60, 25, 24, 25, 30, 24, 28, 25, 15],
  "Archsage": [60, 30, 30, 25, 30, 20, 30, 20, 15]
};
const allCharStats = {};

const buildCharacter = baseStatsStr => {
  var _CHAR_GROWTH_STATS$fi;

  const stats = baseStatsStr.split(',');
  const charName = stats[0];
  const growthRates = (_CHAR_GROWTH_STATS$fi = CHAR_GROWTH_STATS.find(str => str.startsWith(charName))) === null || _CHAR_GROWTH_STATS$fi === void 0 ? void 0 : _CHAR_GROWTH_STATS$fi.split(',').map(rateStr => Number(rateStr) / 100);
  const classArr = CLASSES[charName];

  if (!growthRates) {
    console.log('whoops no growth rate', {
      baseStatsStr
    });
    return;
  }

  if (!classArr) {
    console.log('whoops no class', {
      baseStatsStr
    });
    return;
  }

  let gains = PROMOTION_GAINS[classArr.at(-1)];

  if (!gains) {
    console.log('whoops no promotion gains', {
      baseStatsStr
    });
    gains = [0, 0, 0, 0, 0, 0, 0];
  }

  const statCaps = STAT_CAPS[classArr.at(-1)];

  if (!statCaps) {
    console.log('whoops no stat caps', {
      baseStatsStr
    });
    return;
  }

  allCharStats[charName] = {
    name: charName,
    class: classArr,
    promoted: classArr.at(-1) === stats[1],
    img: `/compressed/felevels/fe7/${charName}.png`,
    startLvl: Number(stats[2]),
    attributes: [{
      name: 'HP',
      base: Number(stats[3]),
      growth: growthRates[1],
      cap: [60, statCaps[0]],
      promote: gains[0]
    }, {
      name: 'Str',
      base: Number(stats[4]),
      growth: growthRates[2],
      cap: [20, statCaps[1]],
      promote: gains[1]
    }, {
      name: 'Skl',
      base: Number(stats[5]),
      growth: growthRates[3],
      cap: [20, statCaps[2]],
      promote: gains[2]
    }, {
      name: 'Spd',
      base: Number(stats[6]),
      growth: growthRates[4],
      cap: [20, statCaps[3]],
      promote: gains[3]
    }, {
      name: 'Lck',
      base: Number(stats[7]),
      growth: growthRates[5],
      cap: [30, statCaps[4]],
      promote: 0
    }, {
      name: 'Def',
      base: Number(stats[8]),
      growth: growthRates[6],
      cap: [20, statCaps[5]],
      promote: gains[4]
    }, {
      name: 'Res',
      base: Number(stats[9]),
      growth: growthRates[7],
      cap: [20, statCaps[6]],
      promote: gains[5]
    }]
  };
};

CHAR_BASE_STATS.forEach(charStr => buildCharacter(charStr));
const oswinData = {
  name: 'Oswin',
  id: 'oswin',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/compressed/felevels/fe7/Oswin.png',
  startLvl: 9,
  attributes: [{
    name: 'HP',
    base: 28,
    growth: .9,
    cap: [60, 60],
    promote: 4
  }, {
    name: 'Str',
    base: 13,
    growth: .4,
    cap: [20, 29],
    promote: 2
  }, {
    name: 'Skl',
    base: 9,
    growth: .3,
    cap: [20, 27],
    promote: 2
  }, {
    name: 'Spd',
    base: 5,
    growth: .3,
    cap: [20, 24],
    promote: 3
  }, {
    name: 'Lck',
    base: 3,
    growth: .35,
    cap: [30, 30],
    promote: 0
  }, {
    name: 'Def',
    base: 13,
    growth: .55,
    cap: [20, 30],
    promote: 2
  }, {
    name: 'Res',
    base: 3,
    growth: .30,
    cap: [20, 25],
    promote: 3
  }]
};
const lynData = {
  name: 'Lyn',
  id: 'lyn',
  class: ['Lord', 'Blade Lord'],
  promoted: false,
  img: '/compressed/felevels/fe7/Lyn.png',
  startLvl: 4,
  attributes: [{
    name: 'HP',
    base: 18,
    growth: .7,
    cap: [60, 60],
    promote: 3
  }, {
    name: 'Str',
    base: 5,
    growth: .4,
    cap: [20, 24],
    promote: 3
  }, {
    name: 'Skl',
    base: 10,
    growth: .6,
    cap: [20, 29],
    promote: 2
  }, {
    name: 'Spd',
    base: 11,
    growth: .6,
    cap: [20, 30],
    promote: 0
  }, {
    name: 'Lck',
    base: 5,
    growth: .55,
    cap: [30, 30],
    promote: 0
  }, {
    name: 'Def',
    base: 2,
    growth: .2,
    cap: [20, 22],
    promote: 3
  }, {
    name: 'Res',
    base: 0,
    growth: .3,
    cap: [20, 22],
    promote: 5
  }]
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MAX_LVL = 39;
const MIN_LVL = 1;

const round = num => {
  return Number(num.toFixed(3));
};

const levelUpAttributes = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  const automaticGrowth = parseInt(attr.growth);
  const growthChance = attr.growth - automaticGrowth;
  return { ...attr,
    avg: attr.avg + attr.growth,
    current: Math.min(cap, (Math.random() < growthChance ? attr.current + 1 : attr.current) + automaticGrowth)
  };
});

const levelDownAttributes = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  const automaticGrowth = parseInt(attr.growth);
  const growthChance = attr.growth - automaticGrowth;
  return { ...attr,
    avg: attr.avg - attr.growth,
    current: Math.min(cap, (Math.random() < growthChance ? attr.current - 1 : attr.current) - automaticGrowth)
  };
});

const promoteStats = attributes => attributes.map(attr => {
  const cap = attr.cap[1];
  return { ...attr,
    avg: attr.avg + attr.promote,
    current: Math.min(cap, attr.current + attr.promote)
  };
});

const unpromoteStats = attributes => attributes.map(attr => {
  const cap = attr.cap[0];
  return { ...attr,
    avg: attr.avg - attr.promote,
    current: Math.min(attr.current - attr.promote)
  };
});

const Attribute = ({
  attr,
  didChange,
  setVal,
  promoted
}) => {
  const cap = attr.cap[promoted ? 1 : 0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "attr__name"
  }, attr.name, ":"), /*#__PURE__*/React.createElement("span", {
    className: "attr__input"
  }, /*#__PURE__*/React.createElement("input", {
    className: `attr__input-form ${attr.current === cap ? 'at-cap' : ''}`,
    type: "number",
    value: attr.current,
    onChange: e => setVal(parseInt(e.target.value))
  }), /*#__PURE__*/React.createElement("span", {
    className: `attr__arrow ${didChange ? 'changed' : ''}`
  }, didChange === 'up' && /*#__PURE__*/React.createElement(React.Fragment, null, "\u21E7"), didChange === 'down' && /*#__PURE__*/React.createElement(React.Fragment, null, "\u21E9"))), /*#__PURE__*/React.createElement("span", {
    className: "attr__avg"
  }, Math.min(cap, round(attr.avg))), /*#__PURE__*/React.createElement("span", {
    className: "attr__growth"
  }, round(attr.growth * 100), "%"), /*#__PURE__*/React.createElement("span", {
    className: `attr__cap ${attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : ''}`
  }, attr.cap[promoted ? 1 : 0]));
};

const Character = ({
  character,
  reset
}) => {
  const initialStats = character.attributes.map(attr => ({ ...attr,
    current: attr.base,
    avg: attr.base
  }));
  const [stats, setStats] = useState(initialStats);
  const prevStats = usePrevious(stats);
  const [statChanged, setStatChanged] = useState(Array(initialStats.length).fill(false));
  const timeoutsRef = useRef({});
  const [promoted, setPromoted] = useState(character.promoted); // the level at which we chose to promote

  const [lvlPromotedAt, setLvlPromotedAt] = useState(20); // unpromoted levels + promoted levels

  const [lvl, setLvl] = useState(character.startLvl); // level after taking account whether or not the user is promoted

  const [displayLvl, setDisplayLvl] = useState(character.startLvl);

  const handleLvlChange = (oldLvl, newLvl) => {
    let newStats = stats;
    const includePromotion = oldLvl < 21 && newLvl > 20 && !promoted; // 20 -> 21 promote if not already

    const includeDemotion = oldLvl > 20 && newLvl < 21; // 21 -> 20 demote

    for (let i = 0; i < Math.abs(newLvl - oldLvl); i++) {
      if (newLvl > oldLvl) {
        newStats = levelUpAttributes(newStats, promoted);
      } else {
        newStats = levelDownAttributes(newStats, promoted);
      }
    }

    setLvl(newLvl);

    if (includePromotion) {
      setPromoted(true);
      setLvlPromotedAt(20);
      newStats = promoteStats(newStats);
    } else if (includeDemotion) {
      setPromoted(false);
      newStats = unpromoteStats(newStats);
    }

    setStats(newStats);
  }; // handle calculating the "display level" based on when we promoted


  useEffect(() => {
    if (!character.promoted && promoted) {
      setDisplayLvl(lvl - lvlPromotedAt + 1);
    } else {
      setDisplayLvl(lvl);
    }
  }, [lvl, promoted]); // if the user de-promotes and the new level is invalid, set us to the lvl promoted at

  useEffect(() => {
    if (!promoted && lvl > 20) {
      handleLvlChange(lvl, lvlPromotedAt);
    }
  }, [promoted]); // handle setting animation flags when values change

  useEffect(() => {
    clearTimeout(timeoutsRef.current.setChanged);
    const changeIcons = [];
    stats.forEach((stat, i) => {
      if (prevStats && stat.current !== prevStats[i].current) {
        if (stat.current < prevStats[i].current) {
          changeIcons.push('down');
        } else {
          changeIcons.push('up');
        }
      } else {
        changeIcons.push(statChanged[i]); // keep as whatever was there before
      }
    });
    setStatChanged(changeIcons);
    timeoutsRef.current.setChanged = setTimeout(() => setStatChanged(Array(initialStats.length).fill(false)), 750);
  }, [stats]);
  return /*#__PURE__*/React.createElement("div", {
    className: "character"
  }, /*#__PURE__*/React.createElement("div", {
    className: "character__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "character__img-wrapper"
  }, /*#__PURE__*/React.createElement("img", {
    className: "character__img",
    src: character.img
  })), /*#__PURE__*/React.createElement("div", {
    className: "character__desc"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "character__name"
  }, character.name), /*#__PURE__*/React.createElement("div", {
    className: "character__lvl"
  }, "Current Level: ", /*#__PURE__*/React.createElement("span", {
    className: "character__lvl-data"
  }, displayLvl)), /*#__PURE__*/React.createElement("div", null, "Class:", ' ', character.promoted ? /*#__PURE__*/React.createElement("span", {
    className: "bold"
  }, character.class[0]) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: promoted ? '' : 'bold'
  }, character.class[0]), " \u2192 ", /*#__PURE__*/React.createElement("span", {
    className: promoted ? 'bold' : ''
  }, character.class[1]))), /*#__PURE__*/React.createElement("div", null, "Total Levels: ", lvl, " (before promotion + after promotion)"), !character.promoted && /*#__PURE__*/React.createElement("div", null, "Promoted at level: ", promoted ? lvlPromotedAt : 'NA'), /*#__PURE__*/React.createElement("button", {
    className: "character__reset",
    onClick: reset
  }, "\u2190 Back to character select"))), /*#__PURE__*/React.createElement("div", {
    className: "character__stats"
  }, /*#__PURE__*/React.createElement("span", {
    className: "attr__name"
  }), /*#__PURE__*/React.createElement("span", {
    className: "attr__input attr__header"
  }, "Current"), /*#__PURE__*/React.createElement("span", {
    className: "attr__avg attr__header"
  }, "Average"), /*#__PURE__*/React.createElement("span", {
    className: "attr__growth attr__header"
  }, "Growth"), /*#__PURE__*/React.createElement("span", {
    className: "attr__cap attr__header"
  }, "Max"), stats.map((attr, i) => /*#__PURE__*/React.createElement(Attribute, {
    key: attr.name,
    attr: attr,
    didChange: statChanged[i],
    promoted: promoted,
    setVal: val => {
      const newStats = [...stats];
      newStats[i].current = val;
      setStats(newStats);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "level_controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "level_btn",
    disabled: lvl === MIN_LVL,
    onClick: () => {
      handleLvlChange(lvl, lvl - 1);
    }
  }, "-1"), /*#__PURE__*/React.createElement("button", {
    className: "level_btn",
    disabled: lvl === MAX_LVL,
    onClick: () => {
      handleLvlChange(lvl, lvl + 1);
    }
  }, "+1"), character.promoted ? /*#__PURE__*/React.createElement("input", {
    style: {
      width: '10rem'
    },
    type: "range",
    min: 1,
    max: 20,
    value: lvl,
    className: "slider",
    onChange: e => {
      const newLvl = Number(e.target.value);
      handleLvlChange(lvl, newLvl);
    }
  }) : /*#__PURE__*/React.createElement("input", {
    style: {
      width: `${(19 + lvlPromotedAt) / 2}rem`
    },
    type: "range",
    min: 1,
    max: 19 + lvlPromotedAt,
    value: lvl,
    className: "slider",
    onChange: e => {
      const newLvl = Number(e.target.value);
      handleLvlChange(lvl, newLvl);
    }
  })), !character.promoted && /*#__PURE__*/React.createElement("div", {
    className: "promote-container"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "promote-input",
    checked: promoted,
    onChange: cb => {
      setPromoted(cb.target.checked);

      if (cb.target.checked) {
        setStats(promoteStats(stats));
        setLvlPromotedAt(lvl);
      } else {
        setStats(unpromoteStats(stats));
        setLvlPromotedAt(20);
      }
    }
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "promote-input"
  }, "Promote"))));
};

const CharacterSelect = ({
  setCharacter
}) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Select a character:"), Object.keys(allCharStats).map(name => /*#__PURE__*/React.createElement("button", {
  key: name,
  onClick: () => setCharacter(name),
  className: "character_select_btn"
}, /*#__PURE__*/React.createElement("img", {
  alt: "",
  src: allCharStats[name].img
}), /*#__PURE__*/React.createElement("p", null, name))));

const App = () => {
  const [character, setCharacter] = useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Fire Emblem 7 Level Up Simulator"), character && /*#__PURE__*/React.createElement(Character, {
    character: allCharStats[character],
    reset: () => setCharacter(null)
  }), !character && /*#__PURE__*/React.createElement(CharacterSelect, {
    setCharacter: setCharacter
  }), /*#__PURE__*/React.createElement("div", {
    className: "instructions"
  }, /*#__PURE__*/React.createElement("h3", null, "Welcome to the Fire Emblem level up simulator (Beta)"), /*#__PURE__*/React.createElement("p", null, "This allows you to predict your specific character's future stats. Curious whether to abandon a character after a series of bad level ups? Wondering if using that item is worth it? This tool can help you out."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "To use it, select a character, then set the level to match your character's current level via the level up buttons or the slider, and set the current stats based on your in-game stats. Then you can use change the level to simulate your character's growth. As they level up, the tool simulates leveling up according to the characters stat growth chances. The current stats then update accordingly, with the arrow icon flashing when a stat changes. You can also see what the average for that stat would be at each level. By default, promotion is assumed to happen at level 20, but you can also manually promote by toggling the checkbox at whatever level you want."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "If you notice any issues or have an functionality requests, feel free to open an issue up here: ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/keithkade/keithkade.github.io/issues"
  }, "https://github.com/keithkade/keithkade.github.io/issues"))));
};

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));
'use strict';

// npx babel --watch stuff/felevels/src --out-dir stuff/felevels/build

/* TODO
Get more real data (write script, find automatic source) fireemblemwiki.org https://serenesforest.net/
Rest of Fe7
- https://serenesforest.net/blazing-sword/characters/average-stats/oswin/
- https://serenesforest.net/blazing-sword/characters/base-stats/
- https://serenesforest.net/blazing-sword/characters/growth-rates/
Improved character picker
=== Release
Game Picker
Support for multiple promotion paths
FE6 - stats https://fea.fewiki.net/fea.php?game=6
FE8 - stats http://fea.fewiki.net/fea.php?character=gilliam&game=8e
"Custom" mode ???
Better Styles ???
*/

const { useState, useRef, useEffect } = React;

// 1 "Name,Class,Lv,HP,S/M,Skl,Spd,Lck,Def,Res,Con,Mov,Affin,Weapon ranks"
// 2 "Eliwood,Lord,1,18,5,5,7,7,5,0,7,5,, C"
// 3 "Lowen,Cavalier,2,23,7,5,7,3,7,0,10,7,, D, D"
// 4 "Marcus,Paladin,1,31,15,15,11,8,10,8,11,8,, A, A,  B"
// 5 "Rebecca,Archer,1,17,4,5,6,4,3,1,5,5,, D"
// 6 "Dorcas,Fighter,3,30,7,7,6,3,3,0,14,5,, C"
// 7 "Bartre,Fighter,2,29,9,5,3,4,4,0,13,5,, D"
// 8 "Hector,Lord,1,19,7,4,5,3,8,0,13,5,, C"
// 9 "Oswin,Knight,9,28,13,9,5,3,13,3,14,4,, B"
// 10 "Serra,Cleric,1,17,2,5,8,6,2,5,4,5,, D"
// 11 "Matthew,Thief,2,18,4,4,11,2,3,0,7,6,, D"
// 12 "Guy,Myrmidon,3,21,6,11,11,5,5,0,5,5,, C"
// 13 "Guy HM,Myrmidon,3,25,8,13,13,5,6,1"
// 14 "Merlinus,Transporter,5,18,0,4,5,12,5,2,25,0,,–"
// 15 "Erk,Mage,1,17,5,6,7,3,2,4,5,5,, D"
// 16 "Priscilla,Troubadour,3,16,6,6,8,7,3,6,4,7,, C"
// 17 "Lyn,Lord,4,18,5,10,11,5,2,0,5,5,, C"
// 18 "Wil,Archer,4,21,6,5,6,7,5,1,6,5,, D"
// 19 "Kent,Cavalier,5,23,8,7,8,4,6,1,9,7,, D, D"
// 20 "Sain,Cavalier,4,22,9,5,7,5,7,0,9,7,, D, D"
// 21 "Florina,Pegasus Knight,3,18,6,8,9,8,4,5,4,7,, D"
// 22 "Name,Class,Lv,HP,S/M,Skl,Spd,Lck,Def,Res,Con,Mov,Affin,Weapon ranks"
// 23 "Raven,Mercenary,5,25,8,11,13,2,5,1,8,5,, C"
// 24 "Raven HM,Mercenary,5,29,10,13,15,2,6,2"
// 25 "Lucius,Monk,3,18,7,6,10,2,1,6,6,5,, D"
// 26 "Canas,Shaman,8,21,10,9,8,7,5,8,7,5,, B"
// 27 "Dart,Pirate,8,34,12,8,8,3,6,1,10,5,, B"
// 28 "Fiora,Pegasus Knight,7,21,8,11,13,6,6,7,5,7,, C"
// 29 "Legault,Thief,12,26,8,11,15,10,8,3,9,6,, C"
// 30 "Legault HM,Thief,12,29,8,13,17,10,8,4"
// 31 "Ninian,Dancer,1,14,0,0,12,10,5,4,4,5,,–"
// 32 "Isadora,Paladin,1,28,13,12,16,10,8,6,6,8,, A, B,  D"
// 33 "Heath,Wyvern Rider,7,28,11,8,7,7,10,1,9,7,, B"
// 34 "Heath HM,Wyvern Rider,7,32,13,10,9,7,11,2"
// 35 "Rath,Nomad,9,27,9,10,11,5,8,2,7,7,, B"
// 36 "Hawkeye,Berserker,4,50,18,14,11,13,14,10,16,6,, A"
// 37 "Geitz,Warrior,3,40,17,12,13,10,11,3,13,6,, B, B"
// 38 "Geitz HM,Warrior,3,44,19,13,14,10,12,4"
// 39 "Wallace,General,1,34,16,9,8,10,19,5,15,5,, A, E"
// 40 "Farina,Pegasus Knight,12,24,10,13,14,10,10,12,5,7,, A"
// 41 "Pent,Sage,6,33,18,21,17,14,11,16,8,6,, A, A"
// 42 "Louise,Sniper,4,28,12,14,17,16,9,12,6,6,, A"
// 43 "Name,Class,Lv,HP,S/M,Skl,Spd,Lck,Def,Res,Con,Mov,Affin,Weapon ranks"
// 44 "Karel,Swordmaster,8,31,16,23,20,15,13,12,9,6,, A"
// 45 "Harken,Hero,8,38,21,20,17,12,15,10,11,6,, B, B"
// 46 "Harken HM,Hero,8,42,23,22,18,12,16,11"
// 47 "Nino,Mage,5,19,7,8,11,10,4,7,3,5,, C"
// 48 "Jaffar,Assassin,13,34,19,25,24,10,15,11,8,6,, A"
// 49 "Vaida,Wyvern Lord,9,43,20,19,13,11,21,6,12,8,, A, A"
// 50 "Vaida HM,Wyvern Lord,9,47,22,21,14,11,22,7"
// 51 "Nils,Bard,Same as Ninian,3,5,,–"
// 52 "Karla,Swordmaster,5,29,14,21,18,16,11,12,7,6,, A"
// 53 "Renault,Bishop,16,43,12,22,20,10,15,18,9,6,, A, A"
// 54 "Athos,Archsage,20,40,30,24,20,25,20,28,9,6,, S S  S  S"

const oswinData = {
  name: 'Oswin',
  id: 'oswin',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/compressed/felevels/fe7/Oswin.png',
  startLvl: 9,
  attributes: [
    { name: 'HP',  base: 28,  growth: .9,  cap: [60, 60], promote: 4 },
    { name: 'Str', base: 13,  growth: .4,  cap: [20, 29], promote: 2 },
    { name: 'Skl', base: 9,   growth: .3,  cap: [20, 27], promote: 2 },
    { name: 'Spd', base: 5,   growth: .3,  cap: [20, 24], promote: 3 },
    { name: 'Lck', base: 3,   growth: .35, cap: [30, 30], promote: 0 },
    { name: 'Def', base: 13,  growth: .55, cap: [20, 30], promote: 2 },
    { name: 'Res', base: 3,   growth: .30, cap: [20, 25], promote: 3 },
  ]
};

const lynData = {
  name: 'Lyn',
  id: 'lyn',
  class: ['Lord', 'Blade Lord'],
  promoted: false,
  img: '/compressed/felevels/fe7/Lyn.png',
  startLvl: 4,
  attributes: [
    { name: 'HP',  base: 18, growth: .7,  cap: [60, 60], promote: 3 },
    { name: 'Str', base: 5,  growth: .4,  cap: [20, 24], promote: 3 },
    { name: 'Skl', base: 10, growth: .6,  cap: [20, 29], promote: 2 },
    { name: 'Spd', base: 11, growth: .6,  cap: [20, 30], promote: 0 },
    { name: 'Lck', base: 5,  growth: .55, cap: [30, 30], promote: 0 },
    { name: 'Def', base: 2,  growth: .2,  cap: [20, 22], promote: 3 },
    { name: 'Res', base: 0,  growth: .3,  cap: [20, 22], promote: 5 },
  ]
};

const characterData = {
  oswin: oswinData,
  lyn: lynData,
}


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const MAX_LVL = 39;
const MIN_LVL = 1;

const round = (num) => Number((num).toFixed(3));

const levelUpAttributes = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  const automaticGrowth = parseInt(attr.growth);
  const growthChance = attr.growth - automaticGrowth;
  return {
    ...attr,
    avg: attr.avg + attr.growth,
    current: Math.min(cap, (Math.random() < growthChance ? attr.current + 1 : attr.current) + automaticGrowth),
  }
});

const levelDownAttributes = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  const automaticGrowth = parseInt(attr.growth);
  const growthChance = attr.growth - automaticGrowth;
  return {
    ...attr,
    avg: attr.avg - attr.growth,
    current: Math.min(cap, (Math.random() < growthChance ? attr.current - 1 : attr.current) - automaticGrowth),
  }
});

const promoteStats = (attributes) => attributes.map(attr => {
  const cap = attr.cap[1];
  return {
    ...attr,
    avg: attr.avg + attr.promote,
    current: Math.min(cap, attr.current + attr.promote),
  }
});

const unpromoteStats = (attributes) => attributes.map(attr => {
  const cap = attr.cap[0];
  return {
    ...attr,
    avg: attr.avg - attr.promote,
    current: Math.min(attr.current - attr.promote),
  };
});

const Attribute = ({ attr, didChange, setVal, promoted }) => {
  const cap = attr.cap[promoted ? 1 : 0];
  return (
    <div>
      <span className="attr__name">{attr.name}:</span>
      <span className="attr__input">
        <input className={`attr__input-form ${attr.current === cap ? 'at-cap' : ''}`} type="number" value={attr.current} onChange={e => setVal(parseInt(e.target.value))} />
        <span className={`attr__arrow ${didChange ? 'changed' : ''}`}>{didChange === 'up' && <>&#8679;</>}{didChange === 'down' && <>&#8681;</>}</span>
      </span>
      <span className="attr__avg">{Math.min(cap, round(attr.avg))}</span>
      <span className="attr__growth">{round(attr.growth * 100)}%</span>
      <span className={`attr__cap ${attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : ''}`}>{attr.cap[promoted ? 1 : 0]}</span>
    </div>
  );
}


const Character = ({ character, reset }) => {
  const initialStats = character.attributes.map(attr => ({...attr, current: attr.base, avg: attr.base}));

  const [stats, setStats] = useState(initialStats);
  const prevStats = usePrevious(stats);
  const [statChanged, setStatChanged] = useState(Array(initialStats.length).fill(false));
  const timeoutsRef = useRef({});

  const [promoted, setPromoted] = useState(character.promoted);

  // the level at which we chose to promote
  const [lvlPromotedAt, setLvlPromotedAt] = useState(20);

  // unpromoted levels + promoted levels
  const [lvl, setLvl] = useState(character.startLvl);

  // level after taking account whether or not the user is promoted
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
  }

  // handle calculating the "display level" based on when we promoted
  useEffect(() => {
    if (promoted) {
      setDisplayLvl(lvl - lvlPromotedAt + 1);
    } else {
      setDisplayLvl(lvl);
    }
  }, [lvl, promoted]);

  // if the user de-promotes and the new level is invalid, set us to the lvl promoted at
  useEffect(() => {
    if (!promoted && lvl > 20) {
      handleLvlChange(lvl, lvlPromotedAt);
    }
  }, [promoted]);

  // handle setting animation flags when values change
  useEffect(() => {
    clearTimeout(timeoutsRef.current.setChanged);
    const changeIcons = []
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
    })
    setStatChanged(changeIcons);
    timeoutsRef.current.setChanged = setTimeout(() => setStatChanged(Array(initialStats.length).fill(false)), 750);
  }, [stats])

  return (
    <div className="character">
      <div className="character__info">
        <div className="character__img-wrapper">
          <img className="character__img" src={character.img} />
        </div>
        <div className="character__desc">
          <h1 className="character__name">{character.name}</h1>
          <div className="character__lvl">Current Level: <span className="character__lvl-data">{displayLvl}</span></div>
          <div>Class: <span className={promoted ? '' : 'bold'}>{character.class[0]}</span> &rarr; <span className={promoted ? 'bold' : ''}>{character.class[1]}</span></div>
          <div>Total Levels: {lvl} (before promotion + after promotion)</div>
          <div>Promoted at level: {promoted ? lvlPromotedAt : 'NA'}</div>
          <button className="character__reset" onClick={reset}>&larr; Back to character select</button>
        </div>
      </div>
      <div className="character__stats">
        <span className="attr__name"></span>
        <span className="attr__input attr__header">Current</span>
        <span className="attr__avg attr__header">Average</span>
        <span className="attr__growth attr__header">Growth</span>
        <span className="attr__cap attr__header">Max</span>
        {stats.map((attr, i) =>
          <Attribute
            key={attr.name}
            attr={attr}
            didChange={statChanged[i]}
            promoted={promoted}
            setVal={(val) => {
              const newStats = [...stats];
              newStats[i].current = val;
              setStats(newStats);
            }}
          />
        )}
        <div className="level_controls">
          <button
            className="level_btn"
            disabled={lvl === MIN_LVL}
            onClick={() => {
              handleLvlChange(lvl, lvl - 1);
            }}>
            -1
          </button>
          <button
            className="level_btn"
            disabled={lvl === MAX_LVL}
            onClick={() => {
              handleLvlChange(lvl, lvl + 1);
            }}>
            +1
          </button>
          <input style={{width: `${(19 + lvlPromotedAt)/2}rem`}} type="range" min={1} max={19 + lvlPromotedAt} value={lvl} className="slider"
            onChange={(e) => {
              const newLvl = Number(e.target.value);
              handleLvlChange(lvl, newLvl);
            }}
          />
        </div>
        <div className="promote-container">
          <input type="checkbox"
            checked={promoted}
            onChange={(cb) => {
              setPromoted(cb.target.checked);
              if (cb.target.checked) {
                setStats(promoteStats(stats));
                setLvlPromotedAt(lvl);
              } else {
                setStats(unpromoteStats(stats));
                setLvlPromotedAt(20);
              }
            }}
          />
          Promote
        </div>
      </div>
    </div>
  )
};

const CharacterSelect = ({ setCharacter }) =>
  <div>
    <h1>Select a character:</h1>
    <img className="character_select_img" onClick={() => setCharacter(oswinData.id)} src={oswinData.img} />
    <img className="character_select_img" onClick={() => setCharacter(lynData.id)} src={lynData.img} />
  </div>


const App = () => {
  const [character, setCharacter] = useState('oswin');
  return (
    <div>
      {character && <Character character={characterData[character]} reset={() => setCharacter(null)}/>}
      {!character && <CharacterSelect setCharacter={setCharacter}/>}
      <div className="instructions">
        <h3>Welcome to the Fire Emblem level up simulator (Beta)</h3>
        <p>This allows you to predict your specific character's future stats. Curious whether to abandon a character after a series of bad level ups?
        Wondering if using that item is worth it? This tool can help you out.</p>
        <br/>
        <p>To use it, select a character, then set the level to match your character's current level via the level up buttons or the slider, and set the current stats based on your in-game stats.
        Then you can use change the level to simulate your character's growth. As they level up, the tool simulates leveling up according to the characters growths.
        The current stats then update accordingly, with the arrow icon flashing when a stat changes. You can also see what the average for that stat would be at each level.
        By default, promotion is assumed to happen at level 20, but you can also manually promote by toggling the checkbox at whatever level you want.</p>
        <br/>
        <p>If you notice any issues or have an functionality requests, feel free to open an issue up here: <a href="https://github.com/keithkade/keithkade.github.io/issues">https://github.com/keithkade/keithkade.github.io/issues</a></p>
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

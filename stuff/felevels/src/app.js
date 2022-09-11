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

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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

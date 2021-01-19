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

const { useState, useEffect } = React;

const oswinData = {
  name: 'Oswin',
  id: 'oswin',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/img/compressed/felevels/fe7/Oswin.png',
  startLvl: 9,
  attributes: [
    { name: 'HP',  base: 28,  growth: .9,  cap: [60, 60], promote: 4 },
    { name: 'Str', base: 13,  growth: .4,  cap: [20, 29], promote: 2 },
    { name: 'Skl', base: 9,   growth: .3,  cap: [20, 27], promote: 2 },
    { name: 'Spd', base: 5,   growth: .3,  cap: [20, 24], promote: 3 },
    { name: 'Lck', base: 3,   growth: .35, cap: [30, 30], promote: 2 },
    { name: 'Def', base: 13,  growth: .55, cap: [20, 30], promote: 3 },
    { name: 'Res', base: 3,   growth: .30, cap: [20, 25], promote: 1 },
  ]
};

const lynData = {
  name: 'Lyn',
  id: 'lyn',
  class: ['Knight', 'General'],
  promoted: false,
  img: '/img/compressed/felevels/fe7/Lyn.png',
  startLvl: 9,
  attributes: [
    { name: 'HP',  base: 28,  growth: .9,  cap: [60, 60], promote: 4 },
    { name: 'Str', base: 13,  growth: .4,  cap: [20, 29], promote: 2 },
    { name: 'Skl', base: 9,   growth: .3,  cap: [20, 27], promote: 2 },
    { name: 'Spd', base: 5,   growth: .3,  cap: [20, 24], promote: 3 },
    { name: 'Lck', base: 3,   growth: .35, cap: [30, 30], promote: 2 },
    { name: 'Def', base: 13,  growth: .55, cap: [20, 30], promote: 3 },
    { name: 'Res', base: 3,   growth: .30, cap: [20, 25], promote: 1 },
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
  return {
    ...attr,
    avg: Math.min(cap, round(attr.avg + attr.growth)),
    current: Math.min(cap, Math.random() < attr.growth ? attr.current + 1 : attr.current),
  }
});

const levelDownAttributes = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  return {
    ...attr,
    avg: Math.min(cap, round(attr.avg - attr.growth)),
    current: Math.min(cap, Math.random() < attr.growth ? attr.current - 1 : attr.current),
  }
});

const promoteStats = (attributes) => attributes.map(attr => ({
  ...attr,
  avg: round(attr.avg + attr.promote),
  current: attr.current + attr.promote,
}));

const unpromoteStats = (attributes) => attributes.map(attr => ({
  ...attr,
  avg: round(attr.avg - attr.promote),
  current: attr.current - attr.promote,
}));

const Attribute = ({ attr, setVal, promoted }) =>
  <div>
    <span className="attr__name">{attr.name}:</span>
    <span className="attr__input">
      <input className={`attr__input-form ${attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : ''}`} type="number" value={attr.current} onChange={e => setVal(parseInt(e.target.value))} />
    </span>
    <span className="attr__avg">{attr.avg}</span>
    <span className="attr__growth">{attr.growth}</span>
    <span className={`attr__cap ${attr.current === attr.cap[promoted ? 1 : 0] ? 'at-cap' : ''}`}>{attr.cap[promoted ? 1 : 0]}</span>
  </div>

const Character = ({ character, reset }) => {
  const initialStats = character.attributes.map(attr => ({...attr, current: attr.base, avg: attr.base}));

  const [stats, setStats] = useState(initialStats);

  const [promoted, setPromoted] = useState(character.promoted);

  // the level at which we chose to promote
  const [lvlPromotedAt, setLvlPromotedAt] = useState(20);

  // unpromoted levels + promoted levels
  const [lvl, setLvl] = useState(character.startLvl);

  // level after taking account whether or not the user is promoted
  const [displayLvl, setDisplayLvl] = useState(character.startLvl);

  const handleLvlChange = (oldLvl, newLvl) => {
    const diff = newLvl - oldLvl;
    let newStats = stats;
    for (let i = 0; i < Math.abs(diff); i++) {
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
      console.log('DEPROMOTED AT LEVEL', lvl);
      handleLvlChange(lvl, lvlPromotedAt);
    }
  }, [promoted]);

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
        <span className="attr__avg attr__header">Average for level</span>
        <span className="attr__growth attr__header">Growth chance</span>
        <span className="attr__cap attr__header">Stat Cap</span>
        {stats.map((attr, i) =>
          <Attribute
            key={attr.name}
            attr={attr}
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
          <input style={{width: `${(19 + lvlPromotedAt)/1.5}rem`}} type="range" min={1} max={19 + lvlPromotedAt} value={lvl} className="slider"
            onChange={(e) => {
              const newLvl = Number(e.target.value);
              handleLvlChange(lvl, newLvl);
            }}
          />
          <button
            className="level_btn"
            disabled={lvl === MAX_LVL}
            onClick={() => {
              handleLvlChange(lvl, lvl + 1);
            }}>
            +1
          </button>
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
  <div className="foooooo">
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
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

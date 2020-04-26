'use strict';

// npx babel --watch stuff/felevels/src --out-dir stuff/felevels/build --presets react-app/prod

/* TODO
Display growth rates
Display actual level (w/ promote)
Auto promote level 20
Shorten slider if promoted
Shorten slider on level
Special styling when capped
Overall styling
Support for growths more than 100%
Get more real data
Character picker
Make promote a toggle
*/

const { useState } = React;

const oswinData = {
  name: 'Oswin',
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

const round = (num) => Math.round(num * 100) / 100;

const levelUp = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  return {
    ...attr,
    avg: Math.min(cap, round(attr.avg + attr.growth)),
    current: Math.min(cap, Math.random() < attr.growth ? attr.current + 1 : attr.current),
  }
});

const levelDown = (attributes, promoted) => attributes.map(attr => {
  const cap = attr.cap[promoted ? 1 : 0];
  return {
    ...attr,
    avg: Math.min(cap, round(attr.avg - attr.growth)),
    current: Math.min(cap, Math.random() < attr.growth ? attr.current - 1 : attr.current),
  }
});

const promote = (attributes) => attributes.map(attr => ({
  ...attr,
  avg: attr.avg + attr.promote,
  current: attr.current + attr.promote,
}));

const Attribute = ({ attr, setVal }) =>
  <div>
    <span className="attr__name">{attr.name}:</span>
    <input className="attr__input" type="text" value={attr.current} onChange={e => setVal(parseInt(e.target.value))} />
    <span className="attr__avg">Avg: {attr.avg}</span>
  </div>

const Character = ({ character }) => {
  const initialStats = character.attributes.map(attr => ({...attr, current: attr.base, avg: attr.base}));
  const [stats, setStats] = useState(initialStats);
  const [promoted, setPromoted] = useState(character.promoted);
  const [lvl, setLvl] = useState(character.startLvl);

  return (
    <div className="character">
      <div className="character__info">
        <h3>{character.name}</h3>
        <div>Class: {character.class[0]} &rarr; {character.class[1]}</div>
        <div>Level: {lvl}</div>
      </div>
      <div className="character__stats">
        {stats.map((attr, i) =>
          <Attribute
            key={attr.name}
            attr={attr}
            setVal={(val) => {
              const newStats = [...stats];
              newStats[i].current = val;
              setStats(newStats);
            }}
          />
        )}
        <button
          onClick={() => {
            setStats(levelUp(stats, promoted));
            setLvl(lvl + 1);
          }}>
          Up
        </button>
        <button
          onClick={() => {
            setStats(levelDown(stats, promoted));
            setLvl(lvl - 1);
          }}>
          Down
        </button>
        <button
          disabled={promoted}
          onClick={() => {
            setPromoted(true);
            setStats(promote(stats));
          }}>
          Promote
        </button>
        <input type="range" min={1} max={39} value={lvl} className="slider"
          onChange={(e) => {
            const newLvl = e.target.value;
            const diff = newLvl - lvl;
            let newStats = stats;
            for (let i = 0; i < Math.abs(diff); i++) {
              if (newLvl > lvl) {
                newStats = levelUp(newStats);
              } else {
                newStats = levelDown(newStats);
              }
            }
            setStats(newStats);
            setLvl(newLvl);
          }}
        />
      </div>
      <img className="character__img" src={character.img} />
    </div>
  )
};

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Character character={oswinData}/>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

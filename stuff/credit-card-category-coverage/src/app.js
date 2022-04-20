'use strict';

// npx babel --watch stuff/credit-card-category-coverage/src --out-dir stuff/credit-card-category-coverage/build

// CARDS is defined in cards.js

const { useState, useRef, useEffect } = React;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const CATEGORIES = [
  { id: 'grocery', name: 'Groceries'},
  { id: 'onlineGrocery', name: 'Online Groceries'},
  { id: 'dining', name: 'Dining '},
  { id: 'diningTakeout', name: 'Dining (Takeout)'},
  { id: 'drugstore', name: 'Drug Stores'},
  { id: 'gas', name: 'Gas'},
  { id: 'transit', name: 'Transit'},
  { id: 'entertainment', name: 'Entertainment'},
  { id: 'hotels', name: 'Hotels'},
  { id: 'streaming', name: 'Streaming'},
  { id: 'homeImprovement', name: 'Home Improvement Stores'},
  { id: 'fitness', name: 'Fitness Clubs'},
  { id: 'travelChasePortal', name: 'Travel via Chase Portal'},
  { id: 'verizon', name: 'Verizon '},
  { id: 'amazon', name: 'Amazon '},
];

const REWARDS = [
  { id: 'chase-ultimate-rewards', name: 'Chase Ultimate Rewards Points', valuation_cpp: 1 },
  { id: 'amex-reward-dollars', name: 'American Express Rewards Dollars', valuation_cpp: 1 },
  { id: 'capital-one-miles', name: 'Capital One Miles', valuation_cpp: 1 },
  { id: 'citi-thankYou-points', name: 'Citi ThankYou Points', valuation_cpp: 1 },
  { id: 'alliant-rewards-points', name: 'Alliant Rewards Points', valuation_cpp: 1 },
  { id: 'amazon-rewards-points', name: 'Amazon Rewards Points', valuation_cpp: 1 },
];

const getBestReward = (cat, selectedCards, customSelections) => {
  let best = 0;
  let bestCard = {};
  CARDS.filter(c => selectedCards.has(c.id)).forEach(card => {
    // skip custom card if category doesn't match
    if (card.custom && card.id in customSelections && customSelections[card.id] !== cat.id) {
      return;
    }

    // get the rewards valuation of the category based on cents per point
    let rewardsType = REWARDS.find(type => type.id === card.rewardsTypeId);
    let rewardsTypeValuation = (rewardsType && rewardsType.valuation_cpp) ? rewardsType.valuation_cpp : 1;

    if (cat.id in card.rewards) {
      let effectiveValue = card.rewards[cat.id] * rewardsTypeValuation;

      if (effectiveValue > best) {
        best = effectiveValue;
        bestCard = card;
      } else if (effectiveValue === best) {
        bestCard = { name: 'Multiple cards' };
      }
    }

    // check if "other" is the best from this card
    let effectiveOtherValue = card.rewards.other * rewardsTypeValuation;
    if (effectiveOtherValue > best) {
      best = effectiveOtherValue;
      bestCard = card;
    } else if (effectiveOtherValue === best) {
      bestCard = { name: 'Multiple cards'}
    }
  })

  // color-code the reward tier
  let tier = 'bad';
  if (best >= .01) tier = 'meh';
  if (best >= .02) tier = 'ok';
  if (best >= .03) tier = 'good';
  if (best >= .04) tier = 'great';
  if (best >= .05) tier = 'best';
  return (<>
    <span className={`percent tier-${tier}`}>{`${best * 100}%`}</span>
    <span className='best-card'>{`${bestCard.name ? ` via ${bestCard.name}` : '' }`}</span>
  </>);
}

const Card = ({ card, selectedCards, selectCard, unSelectCard, customSelections, setCustomSelections }) => {
  const validCats = CATEGORIES.filter(c => c.id in card.rewards);
  const initial = validCats.length ? validCats[0].id : '';
  const [customCat, setCustomCat] = useState(initial);

  useEffect(() => {
    if (card.custom && selectedCards.has(card.id)) {
       setCustomSelections({
         ...customSelections,
         [card.id]: customCat
       });
    }
  }, [customCat, selectedCards])

  return (
    <div>
      <input
        name={`${card.id}-checkbox`}
        type="checkbox"
        onChange={e => {
          if (e.target.checked) {
            selectCard(card.id);
          } else {
            unSelectCard(card.id);
          }
        }}
      />
      <label className="label" htmlFor={`${card.id}-checkbox`}>{card.name}</label>
      {card.custom &&
        <select
          className="label"
          name="cars"
          id="cars"
          onChange={e => setCustomCat(e.target.value)}
        >
          {validCats.map(cat =>
            <option key={`${cat.id}-${card.id}`} value={cat.id}>{cat.name}</option>
          )}
        </select>
      }
    </div>
  );
}


const Category = ({ cat, selectedCards, customSelections }) =>
  <div className="cat-row">
    <span className="cat-name">{cat.name}</span>
    {getBestReward(cat, selectedCards, customSelections)}
  </div>

const App = () => {
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [customSelections, setCustomSelections] = useState({});

  const selectCard = (cardId) => {
    selectedCards.add(cardId);
    setSelectedCards(new Set(selectedCards));
  }

  const unSelectCard = (cardId) => {
    selectedCards.delete(cardId);
    setSelectedCards(new Set(selectedCards));
  }

  return (
    <div>
      <div className="cards">
        <h3 className="column-title">Cards:</h3>
        {CARDS.map(card => (
          <Card
            selectCard={selectCard}
            unSelectCard={unSelectCard}
            selectedCards={selectedCards}
            customSelections={customSelections}
            setCustomSelections={setCustomSelections}
            key={card.id}
            card={card}
          />))}
      </div>
      <div className="categories">
        <h3 className="column-title">Categories:</h3>
        {CATEGORIES.map(cat => (<Category selectedCards={selectedCards} customSelections={customSelections} key={cat.id} cat={cat} />))}
      </div>
      <br/>
      <br/>
      <br/>
      <div className="instructions">
        <h3>Welcome to the Credit Card Category Coverage Chart (Alpha)</h3>
        <p>This allows you to find category gaps in your credit card setup. Just select which cards you have/want and see your rewards per category.
        More functionality coming soon. Feel free to contribute changes or open requests in the <a target="_blank" href="https://github.com/keithkade/keithkade.github.io/tree/master/stuff/credit-card-category-coverage">code repo</a>. Make a PR to develop and I will merge/build/deploy the updates</p>
      </div>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

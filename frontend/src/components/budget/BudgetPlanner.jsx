import React, { useMemo, useState } from "react";

export default function BudgetPlanner({ onSave }) {
  const [days, setDays] = useState(3);
  const [travellers, setTravellers] = useState(2);
  const [stay, setStay] = useState(2000);
  const [food, setFood] = useState(700);
  const [transport, setTransport] = useState(800);
  const [activities, setActivities] = useState(500);

  const total = useMemo(
    () => days * travellers * (food + transport + activities) + days * stay,
    [days, travellers, stay, food, transport, activities]
  );

  const save = () => onSave?.({ days, travellers, stay, food, transport, activities, total });

  return (
    <section className="budget-planner">
      <div className="component-section-heading">
        <div><small>BUDGET</small><h2>Plan your trip budget</h2></div>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>
      <div className="budget-grid">
        <label>Days<input type="number" min="1" value={days} onChange={e => setDays(+e.target.value || 1)} /></label>
        <label>Travellers<input type="number" min="1" value={travellers} onChange={e => setTravellers(+e.target.value || 1)} /></label>
        <label>Stay / day<input type="number" min="0" value={stay} onChange={e => setStay(+e.target.value || 0)} /></label>
        <label>Food / person / day<input type="number" min="0" value={food} onChange={e => setFood(+e.target.value || 0)} /></label>
        <label>Transport / person / day<input type="number" min="0" value={transport} onChange={e => setTransport(+e.target.value || 0)} /></label>
        <label>Activities / person / day<input type="number" min="0" value={activities} onChange={e => setActivities(+e.target.value || 0)} /></label>
      </div>
      <button className="primary-component-button" onClick={save}>Save Budget</button>
    </section>
  );
}

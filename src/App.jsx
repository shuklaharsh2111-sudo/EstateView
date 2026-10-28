
import { useState } from 'react';
import './App.css';

const initialValues = {
  duration: 6,
  inventory: 500,
  leads: 10000,
  costPerLead: 500,
  leadToVisit: 20,
  visitToBooking: 10,
};

const controls = [
  {
    key: 'duration',
    label: 'Duration in Months',
    min: 1,
    max: 12,
    step: 1,
    format: (value) => `${value} months`,
  },
  {
    key: 'inventory',
    label: 'Available Inventory',
    min: 1,
    max: 1000,
    step: 1,
    format: (value) =>
      `${Number(value).toLocaleString('en-IN')} units`,
  },
  {
    key: 'leads',
    label: 'Number of Raw Leads',
    min: 1,
    max: 50000,
    step: 100,
    format: (value) =>
      Number(value).toLocaleString('en-IN'),
  },
  {
    key: 'costPerLead',
    label: 'Cost per Lead',
    min: 50,
    max: 2000,
    step: 50,
    format: (value) =>
      `₹${Number(value).toLocaleString('en-IN')}`,
  },
  {
    key: 'leadToVisit',
    label: 'Lead → Completed Site Visit',
    min: 1,
    max: 100,
    step: 1,
    format: (value) => `${value}%`,
  },
  {
    key: 'visitToBooking',
    label: 'Completed Site Visit → Booking',
    min: 1,
    max: 100,
    step: 1,
    format: (value) => `${value}%`,
  },
];

function App() {
  const [values, setValues] = useState(initialValues);

  const updateValue = (key, value) => {
    setValues((previous) => ({
      ...previous,
      [key]: Number(value),
    }));
  };

  const totalVisits = Math.floor(
    (values.leads * values.leadToVisit) / 100
  );

  const totalBookings = Math.floor(
    (totalVisits * values.visitToBooking) / 100
  );

  const totalSpend = values.leads * values.costPerLead;

  const absorbedUnits = Math.min(
    totalBookings,
    values.inventory
  );

  const remainingInventory = Math.max(
    0,
    values.inventory - absorbedUnits
  );

  const absorptionRate =
    values.inventory > 0
      ? (absorbedUnits / values.inventory) * 100
      : 0;

  const monthlyBookings = totalBookings / values.duration;

  const formatNumber = (number) =>
    Math.round(number).toLocaleString('en-IN');

  const formatCurrency = (number) =>
    `₹${Math.round(number).toLocaleString('en-IN')}`;

  const resetSimulator = () => {
    setValues({ ...initialValues });
  };

  return (
    <main className="simulator">
      {/* Header */}
      <header className="simulator-header">
        <div className="brand-logo">
          <img
            src="/primarylogo.png"
            alt="Company Logo"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h1>
          Real Estate Sales and
          <span> Inventory Absorption Simulator</span>
        </h1>
      </header>

      {/* Simulation Parameters */}
      <section className="controls-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              SIMULATION PARAMETERS
            </span>
            <h2>Adjust your assumptions</h2>
          </div>

          <button
            className="reset-button"
            onClick={resetSimulator}
            type="button"
          >
            Reset values
          </button>
        </div>

        <div className="barometer-grid">
          {controls.map((control, index) => {
            const value = values[control.key];

            const percentage =
              ((value - control.min) /
                (control.max - control.min)) *
              100;

            return (
              <div
                className="barometer-card"
                key={control.key}
              >
                <div className="barometer-top">
                  <div className="parameter-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="parameter-info">
                    <label htmlFor={control.key}>
                      {control.label}
                    </label>

                    <div className="parameter-value">
                      {control.format(value)}
                    </div>
                  </div>
                </div>

                <div className="slider-wrapper">
                  <input
                    id={control.key}
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    style={{
                      '--slider-progress': `${percentage}%`,
                    }}
                    onChange={(event) =>
                      updateValue(
                        control.key,
                        event.target.value
                      )
                    }
                    aria-label={control.label}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simulation Results */}
      <section className="results-section">
        <div className="results-heading">
          <div>
            <span className="eyebrow">
              LIVE CALCULATIONS
            </span>
            <h2>Simulation results</h2>
          </div>

          <span className="live-indicator">
            <span className="live-dot"></span>
            Updating live
          </span>
        </div>

        <div className="results-grid">
          <article className="result-card">
            <span className="result-label">
              Estimated Site Visits
            </span>
            <strong>{formatNumber(totalVisits)}</strong>
            <p>From total raw leads</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Estimated Bookings
            </span>
            <strong>{formatNumber(totalBookings)}</strong>
            <p>Based on conversion rates</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Inventory Absorption
            </span>
            <strong>{absorptionRate.toFixed(1)}%</strong>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${absorptionRate}%` }}
              ></div>
            </div>

            <p>{formatNumber(absorbedUnits)} units absorbed</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Remaining Inventory
            </span>
            <strong>{formatNumber(remainingInventory)}</strong>
            <p>Units remaining after bookings</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Total Lead Generation Cost
            </span>
            <strong>{formatCurrency(totalSpend)}</strong>
            <p>Raw leads × cost per lead</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Average Monthly Bookings
            </span>
            <strong>{monthlyBookings.toFixed(1)}</strong>
            <p>Estimated bookings per month</p>
          </article>
        </div>

        <div className="simulation-note">
          <span className="note-icon">i</span>
          <p>
            These are illustrative estimates, not guaranteed sales.
            Bookings are calculated using the selected conversion
            rates. Inventory absorption is capped at available units.
            The model assumes constant conversion rates throughout
            the selected duration.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;

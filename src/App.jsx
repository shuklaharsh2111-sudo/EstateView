
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
    format: (value) => `${Number(value).toLocaleString('en-IN')} units`,
  },
  {
    key: 'leads',
    label: 'Number of Raw Leads',
    min: 1,
    max: 50000,
    step: 100,
    format: (value) => Number(value).toLocaleString('en-IN'),
  },
  {
    key: 'costPerLead',
    label: 'Cost per Lead',
    min: 50,
    max: 2000,
    step: 50,
    format: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
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

  const projectBookings = Math.floor(
    (totalVisits * values.visitToBooking) / 100
  );

  const leadAcquisitionSpend =
    values.leads * values.costPerLead;

  const monthlyBookings =
    projectBookings / values.duration;

  const mediaCacPerBooking =
    projectBookings > 0
      ? leadAcquisitionSpend / projectBookings
      : 0;

  const absorbedUnits = Math.min(
    projectBookings,
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

  const selloutTime =
    monthlyBookings > 0
      ? values.inventory / monthlyBookings
      : null;

  const formatNumber = (number) =>
    Math.round(number).toLocaleString('en-IN');

  const formatCurrency = (number) =>
    `₹${Math.round(number).toLocaleString('en-IN')}`;

  const resetSimulator = () => {
    setValues({ ...initialValues });
  };

  return (
    <main className="simulator">
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
              Expected Site Visits
            </span>
            <strong>{formatNumber(totalVisits)}</strong>
            <p>
              Estimated completed visits from raw leads
            </p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Lead Acquisition Spend
            </span>
            <strong>
              {formatCurrency(leadAcquisitionSpend)}
            </strong>
            <p>Total leads × cost per lead</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Monthly Bookings
            </span>
            <strong>{monthlyBookings.toFixed(1)}</strong>
            <p>Average projected bookings per month</p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Project Bookings
            </span>
            <strong>{formatNumber(projectBookings)}</strong>
            <p>
              Estimated bookings over the selected
              duration, before inventory cap
            </p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Media CAC / Booking
            </span>
            <strong>
              {projectBookings > 0
                ? formatCurrency(mediaCacPerBooking)
                : 'N/A'}
            </strong>
            <p>
              Lead acquisition spend ÷ project bookings
            </p>
          </article>

          <article className="result-card">
            <span className="result-label">
              Sellout Time
            </span>
            <strong>
              {selloutTime !== null
                ? `${selloutTime.toFixed(1)} months`
                : 'N/A'}
            </strong>
            <p>
              Estimated time to absorb the full inventory
              at the projected booking pace
            </p>
          </article>

          <article className="result-card absorption-card">
            <span className="result-label">
              Projected Inventory Absorption
            </span>

            <strong>{absorptionRate.toFixed(1)}%</strong>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="Projected inventory absorption"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(
                absorptionRate.toFixed(1)
              )}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${absorptionRate}%`,
                }}
              ></div>
            </div>

            <p>
              {formatNumber(absorbedUnits)} of{' '}
              {formatNumber(values.inventory)} units
              projected to be absorbed
            </p>

            <p>
              {formatNumber(remainingInventory)} units
              remaining
            </p>
          </article>
        </div>

        <div className="simulation-note">
          <span className="note-icon">i</span>
          <p>
            These are illustrative estimates, not guaranteed
            sales. Expected site visits and project bookings
            use the selected conversion rates. Media CAC is
            calculated using lead acquisition spend only.
            Projected inventory absorption is capped at
            available inventory. Sellout time assumes the
            projected booking pace remains constant.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;

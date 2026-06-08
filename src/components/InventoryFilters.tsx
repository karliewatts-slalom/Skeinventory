const WEIGHT_CATEGORIES = [
  'Lace',
  'Fingering',
  'Sport',
  'DK',
  'Worsted',
  'Aran',
  'Bulky',
]

const MATERIAL_TYPES = ['Wool', 'Cotton', 'Acrylic', 'Alpaca', 'Silk', 'Blend']

interface ToggleGroupProps {
  label: string
  options: string[]
  highlight: string
}

const ToggleGroup = ({ label, options, highlight }: ToggleGroupProps) => (
  <div className="filter-section">
    <h4>{label}</h4>
    <div className="pill-row" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`pill ${option === highlight ? 'is-highlight' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
)

export const InventoryFilters = () => {
  return (
    <aside className="filters-panel" aria-label="Inventory filters">
      <h2>Filters</h2>

      <section className="filter-section">
        <h3>Weight Category</h3>
        <ul>
          {WEIGHT_CATEGORIES.map((category) => (
            <li key={category}>
              <label>
                <input type="checkbox" />
                <span>{category}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="filter-section">
        <h3>Material Type</h3>
        <ul>
          {MATERIAL_TYPES.map((material) => (
            <li key={material}>
              <label>
                <input type="checkbox" />
                <span>{material}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <ToggleGroup
        label="Hand Dyed"
        options={['Yes', 'No', 'Any']}
        highlight="Any"
      />
      <ToggleGroup
        label="Superwash"
        options={['Yes', 'No', 'Any']}
        highlight="Any"
      />
      <ToggleGroup
        label="Status"
        options={['Active', 'Archived', 'All']}
        highlight="All"
      />
    </aside>
  )
}

import { WEIGHT_CATEGORIES, type WeightCategory } from '../types/yarn'
import type {
  InventoryAttributeFilters,
  ToggleFilterValue,
} from '../services/inventoryFilters'

interface InventoryFiltersProps {
  filters: InventoryAttributeFilters
  makerOptions: string[]
  onWeightCategoryToggle: (value: WeightCategory) => void
  onMakerChange: (value: string) => void
  onHandDyedChange: (value: ToggleFilterValue) => void
  onSuperwashChange: (value: ToggleFilterValue) => void
  onClear: () => void
}

interface ToggleGroupProps {
  label: string
  selected: ToggleFilterValue
  onChange: (value: ToggleFilterValue) => void
}

const ToggleGroup = ({ label, selected, onChange }: ToggleGroupProps) => (
  <div className="filter-section">
    <h4>{label}</h4>
    <div className="pill-row" role="group" aria-label={label}>
      <button
        type="button"
        className={`pill ${selected === 'yes' ? 'is-highlight' : ''}`}
        onClick={() => onChange('yes')}
      >
        Yes
      </button>
      <button
        type="button"
        className={`pill ${selected === 'no' ? 'is-highlight' : ''}`}
        onClick={() => onChange('no')}
      >
        No
      </button>
      <button
        type="button"
        className={`pill ${selected === 'any' ? 'is-highlight' : ''}`}
        onClick={() => onChange('any')}
      >
        Any
      </button>
    </div>
  </div>
)

const toTitleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const InventoryFilters = ({
  filters,
  makerOptions,
  onWeightCategoryToggle,
  onMakerChange,
  onHandDyedChange,
  onSuperwashChange,
  onClear,
}: InventoryFiltersProps) => {
  return (
    <aside className="filters-panel" aria-label="Inventory filters">
      <h2>Filters</h2>

      <section className="filter-section">
        <h3>Weight Category</h3>
        <ul>
          {WEIGHT_CATEGORIES.map((category) => {
            const label = toTitleCase(category)

            return (
            <li key={category}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.weightCategories.includes(category)}
                  onChange={() => onWeightCategoryToggle(category)}
                />
                <span>{label}</span>
              </label>
            </li>
            )
          })}
        </ul>
      </section>

      <section className="filter-section">
        <h3>Maker</h3>
        <label className="filters-select-label" htmlFor="maker-filter">
          Select maker
        </label>
        <select
          id="maker-filter"
          className="filters-select"
          value={filters.maker}
          onChange={(event) => onMakerChange(event.target.value)}
        >
          <option value="">All makers</option>
          {makerOptions.map((maker) => (
            <option key={maker} value={maker}>
              {maker}
            </option>
          ))}
        </select>
      </section>

      <ToggleGroup
        label="Hand Dyed"
        selected={filters.handDyed}
        onChange={onHandDyedChange}
      />
      <ToggleGroup
        label="Superwash"
        selected={filters.superwash}
        onChange={onSuperwashChange}
      />

      <button type="button" className="pill filters-clear" onClick={onClear}>
        Clear Filters
      </button>
    </aside>
  )
}

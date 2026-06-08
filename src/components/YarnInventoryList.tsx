import type { Yarn } from '../types/yarn'

interface YarnInventoryListProps {
  records: Yarn[]
  isLoading: boolean
  onEdit: (record: Yarn) => void
  onArchive: (recordId: string) => void
  onRestore: (recordId: string) => void
}

const formatQuantity = (value: number): string =>
  `${value} ${value === 1 ? 'skein' : 'skeins'}`

const formatWeightCategory = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

const Badge = ({
  label,
  tone,
}: {
  label: string
  tone: 'pink' | 'purple' | 'sand'
}) => <span className={`badge badge-${tone}`}>{label}</span>

const getImageAltText = (record: Yarn): string =>
  `${record.maker} ${record.yarnName}`.trim()

export const YarnInventoryList = ({
  records,
  isLoading,
  onEdit,
  onArchive,
  onRestore,
}: YarnInventoryListProps) => {
  if (isLoading) {
    return <p className="inventory-state">Loading inventory...</p>
  }

  if (records.length === 0) {
    return (
      <p className="inventory-state">
        No yarn records yet. Use Add New Skeinventory to create your first
        entry.
      </p>
    )
  }

  return (
    <section className="inventory-grid" aria-label="Yarn inventory list">
      {records.map((record) => (
        <article
          className={`inventory-card ${record.archived ? 'is-archived' : ''}`}
          key={record.id}
        >
          {record.archived && (
            <span className="archived-pill" aria-label="Archived">
              Archived
            </span>
          )}

          {record.imageUrl ? (
            <img
              className="card-image"
              src={record.imageUrl}
              alt={getImageAltText(record)}
              loading="lazy"
            />
          ) : (
            <div className="card-image card-image-placeholder" aria-hidden="true">
              <span>image</span>
            </div>
          )}

          <div className="card-content">
            <p className="card-maker">{record.maker}</p>
            <h3>{record.yarnName}</h3>

            <div className="badge-row">
              {record.handDyed && <Badge label="Hand Dyed" tone="pink" />}
              {record.superwash && <Badge label="Superwash" tone="purple" />}
              <Badge
                label={formatWeightCategory(record.weightCategory)}
                tone="sand"
              />
            </div>

            <div className="stats-grid">
              <div>
                <p className="stat-label">Material</p>
                <p>{record.materialType}</p>
              </div>
              <div>
                <p className="stat-label">Quantity</p>
                <p>{formatQuantity(record.quantityInStock)}</p>
              </div>
            </div>

            <p className="totals-row">
              {record.totalYardage ?? 0} yds {record.totalMeters ?? 0}m{' '}
              {record.totalGrams ?? 0}g
            </p>

            <button
              type="button"
              className="card-edit-button"
              onClick={() => onEdit(record)}
            >
              Edit
            </button>
            {!record.archived && (
              <button
                type="button"
                className="card-edit-button"
                onClick={() => onArchive(record.id)}
              >
                Archive
              </button>
            )}
            {record.archived && (
              <button
                type="button"
                className="card-edit-button"
                onClick={() => onRestore(record.id)}
              >
                Restore
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

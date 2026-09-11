# Manufacturing customer-outcome measurement

Use this framework for every order-intake or RFQ-intake opportunity so modeled value, pilot evidence, and sustained customer outcomes remain distinct.

## 1. Define the unit of work

Choose one repeatable unit before collecting data:

- One customer PO
- One blanket-order release
- One change order
- One RFQ package
- One drawing/specification package

Document the entry channel, start event, completion event, approval boundary, and destination system.

## 2. Establish the baseline

Collect a representative sample of the current process using the same definitions that will be used during the pilot.

Required fields:

- `received_at`
- `first_review_at`
- `ready_for_approval_at`
- `completed_at`
- Human touch minutes
- Human touch count
- Missing-information event
- Exception type
- Rework event
- Error escape
- Owner or team
- Customer or order class
- Document type and revision count

## 3. Measure the configured workflow

For the same unit of work, record:

- Agent execution status
- Confidence or review reason
- Exception category
- Human correction minutes
- Human approval minutes
- Successful destination-system handoff
- Retry or failure reason
- Final completion timestamp

## 4. Calculate like-for-like outcomes

- **Elapsed cycle time:** `completed_at - received_at`
- **Time to first review:** `first_review_at - received_at`
- **Human touch time per item:** sum of active human minutes
- **Touches per item:** count of distinct human interventions
- **First-pass accuracy:** items requiring no corrective rework divided by completed items
- **Exception rate:** items routed for judgment divided by processed items
- **Validated execution rate:** items completing the defined agent scope without manual redo divided by processed items
- **Capacity returned:** baseline human minutes minus pilot human minutes
- **Avoidable rework value:** prevented rework events multiplied by an agreed cost per event

Keep quote win rate, revenue, margin, and production-start impact separate unless the measurement design can reasonably connect the workflow change to that commercial outcome.

## 5. Evidence levels

1. **Directional model** — prospect-entered or default assumptions.
2. **Measured baseline** — observed current-state data using defined units.
3. **Validated pilot** — like-for-like comparison on representative work.
4. **Sustained deployment outcome** — the same measure holds after adoption and operating variation.
5. **Published result** — customer, workflow, period, calculation, and limitations are approved for external use.

Never present a directional model as a customer result. Never generalize one deployment’s result to every manufacturer.

## 6. Review cadence

- Review baseline definitions before configuration begins.
- Inspect exceptions and corrections during the pilot, not only at the end.
- Compare outcomes at the first stable operating checkpoint.
- Recheck after material changes to documents, customers, rules, or integrations.
- Request customer approval before publishing names, quotations, or quantitative outcomes.

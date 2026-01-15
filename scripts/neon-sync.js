import pg from 'pg';

const { Client } = pg;

const TABLES = {
  savings_calculator_form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL'],
    ['phone', 'text', ''],
    ['income', 'text', ''],
    ['filing_status', 'text', ''],
    ['dependents', 'text', ''],
    ['home_owner', 'text', '']
  ],
  free_review_form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL'],
    ['phone', 'text', ''],
    ['tax_year', 'text', ''],
    ['message', 'text', '']
  ],
  book_session_form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL'],
    ['phone', 'text', ''],
    ['preferred_date', 'text', ''],
    ['preferred_time', 'text', ''],
    ['message', 'text', '']
  ],
  form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL'],
    ['phone', 'text', ''],
    ['message', 'text', '']
  ],
  pdf_guide_form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL']
  ],
  self_interview_form: [
    ['datestamp', 'timestamptz', 'DEFAULT now()'],
    ['name', 'text', 'NOT NULL'],
    ['email', 'text', 'NOT NULL'],
    ['phone', 'text', ''],
    ['ssn', 'text', ''],
    ['address', 'text', ''],
    ['city', 'text', ''],
    ['state', 'text', ''],
    ['zip', 'text', ''],
    ['filing_status', 'text', ''],
    ['wages', 'text', ''],
    ['interest', 'text', ''],
    ['dividends', 'text', ''],
    ['ira_distributions', 'text', ''],
    ['unemployment', 'text', ''],
    ['dependents', 'jsonb', ''],
    ['files', 'jsonb', '']
  ]
};

async function ensureTable(client, tableName, columns) {
  const colsSql = columns.map(([name, type, modifiers]) => `"${name}" ${type} ${modifiers}`.trim());
  await client.query(
    `CREATE TABLE IF NOT EXISTS "${tableName}" (id BIGSERIAL PRIMARY KEY, ${colsSql.join(', ')})`
  );

  for (const [name, type, modifiers] of columns) {
    await client.query(
      `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${name}" ${type} ${modifiers}`.trim()
    );
  }
}

async function ensureIndexes(client) {
  const indexTargets = [
    ['savings_calculator_form', 'email'],
    ['savings_calculator_form', 'datestamp'],
    ['free_review_form', 'email'],
    ['free_review_form', 'datestamp'],
    ['book_session_form', 'email'],
    ['book_session_form', 'datestamp'],
    ['form', 'email'],
    ['form', 'datestamp'],
    ['pdf_guide_form', 'email'],
    ['pdf_guide_form', 'datestamp'],
    ['self_interview_form', 'email'],
    ['self_interview_form', 'datestamp']
  ];

  for (const [tableName, column] of indexTargets) {
    const indexName = `idx_${tableName}_${column}`;
    await client.query(`CREATE INDEX IF NOT EXISTS "${indexName}" ON "${tableName}" ("${column}")`);
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    for (const [tableName, columns] of Object.entries(TABLES)) {
      await ensureTable(client, tableName, columns);
    }
    await ensureIndexes(client);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Schema sync failed:', error);
  process.exit(1);
});

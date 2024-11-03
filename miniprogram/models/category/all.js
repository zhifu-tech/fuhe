import list from './list';
export default async function ({ tag, saasId }) {
  let pageNumber = 0;
  let results = [];
  let totals = 0;
  do {
    ++pageNumber;
    const { records, total } = await list({ tag, saasId, pageNumber });
    totals = total;
    results = [...results, ...records];
  } while (results.length < totals);

  return { records: results, total: results.length };
}

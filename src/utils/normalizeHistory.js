// Handles both { question, answer, sources } records and { role, content } messages
export default function normalizeHistory(items) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((m, i) => {
    const key = m.id ?? m._id ?? i;
    if (m.question !== undefined && m.answer !== undefined) {
      return [
        { id: `${key}-q`, role: 'user', content: m.question },
       { id: `${key}-a`, role: 'assistant', content: m.answer, sources: m.sourceChunks ?? m.sources ?? [] },
      ];
    }
    return [{ id: key, role: m.role, content: m.content, sources: m.sources ?? [] }];
  });
}
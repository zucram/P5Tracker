import schoolAnswers from './schoolAnswers.json' with { type: 'json' };

export function withSchoolAnswers(months, entries = schoolAnswers.entries) {
  return months.map(month => ({
    ...month,
    tasks: [
      ...month.tasks.filter(task => !task.text.includes('Answer:') && !task.text.includes('Exam:')),
      ...entries.filter(entry => entry.month === month.id).map(entry => ({
        id: entry.appTaskId || entry.id,
        text: `${Number(entry.date.slice(0, 2))}/${Number(entry.date.slice(3))} ${entry.type === 'exam' ? 'Exam' : 'Answer'}: ${entry.answers.map(answer => `"${answer}"`).join(' → ')}`,
        isMissable: true,
      })),
    ],
  }));
}

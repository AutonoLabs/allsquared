import { describe, expect, it } from 'vitest';
import { renderTemplate, buildTemplateVariablesFromBuilder } from '../../shared/template-render';

describe('renderTemplate', () => {
  it('replaces bracket and mustache variables', () => {
    const md = '# Agreement\nClient: [CLIENT_NAME]\nFee: {{CONTRACT_VALUE}}';
    const out = renderTemplate(md, { CLIENT_NAME: 'Acme Ltd', CONTRACT_VALUE: '5000' });
    expect(out).toContain('Acme Ltd');
    expect(out).toContain('5000');
  });
});

describe('buildTemplateVariablesFromBuilder', () => {
  it('maps party and module answers to legal template vars', () => {
    const vars = buildTemplateVariablesFromBuilder({
      partyA: { name: 'Dev Co', address: '1 Dev Street' },
      partyB: { name: 'Client Co', address: '2 Client Road' },
      modules: [
        {
          id: 'payment',
          answers: { pay_total: '10000', pay_currency: 'GBP', pay_schedule: 'Milestones' },
        },
        {
          id: 'timeline',
          answers: { time_start: '2026-07-01', time_end: '2026-12-01' },
        },
      ],
    });

    expect(vars.CLIENT_NAME).toBe('Client Co');
    expect(vars.SUPPLIER_NAME).toBe('Dev Co');
    expect(vars.CONTRACT_VALUE).toBe('10000');
    expect(vars.START_DATE).toBe('2026-07-01');
  });
});

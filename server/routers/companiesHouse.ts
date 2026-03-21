import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';

const CH_API_URL = 'https://api.company-information.service.gov.uk';
const CH_API_KEY = process.env.COMPANIES_HOUSE_API_KEY || '';

async function chRequest(path: string) {
  if (!CH_API_KEY) {
    return null;
  }
  const resp = await fetch(`${CH_API_URL}${path}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(CH_API_KEY + ':').toString('base64')}`,
    },
  });
  if (!resp.ok) {
    console.warn(`[CH] ${path} returned ${resp.status}`);
    return null;
  }
  return resp.json();
}

function formatCHAddress(addr: any): string {
  if (!addr) return '';
  const parts = [
    addr.premises,
    addr.address_line_1,
    addr.address_line_2,
    addr.locality,
    addr.region,
    addr.postal_code,
    addr.country,
  ].filter(Boolean);
  return parts.join(', ');
}

// Validate UK company number format
function isValidCompanyNumber(num: string): boolean {
  // 8 digits (England/Wales), or 2 letters + 6 digits (Scotland SC, NI NI, etc.)
  return /^[0-9]{8}$/.test(num) || /^(SC|NI|OC|SO|NC|NF|IP|SP|IC|SI|NP|NO|RC|SR)[0-9]{6}$/i.test(num);
}

export const companiesHouseRouter = router({
  search: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(20).optional().default(10),
    }))
    .query(async ({ input }) => {
      if (!CH_API_KEY) {
        return {
          items: [],
          message: 'Companies House API key not configured. Set COMPANIES_HOUSE_API_KEY env var.',
        };
      }

      const data = await chRequest(
        `/search/companies?q=${encodeURIComponent(input.query)}&items_per_page=${input.limit}`
      );

      if (!data?.items) return { items: [], message: null };

      return {
        items: data.items.map((c: any) => ({
          companyNumber: c.company_number,
          companyName: c.title,
          companyStatus: c.company_status,
          companyType: c.company_type,
          dateOfCreation: c.date_of_creation,
          address: formatCHAddress(c.address),
          addressObj: c.address ? {
            line1: [c.address.premises, c.address.address_line_1].filter(Boolean).join(' '),
            line2: c.address.address_line_2 || '',
            city: c.address.locality || '',
            county: c.address.region || '',
            postcode: c.address.postal_code || '',
            country: c.address.country || 'United Kingdom',
          } : null,
        })),
        message: null,
      };
    }),

  get: protectedProcedure
    .input(z.object({ companyNumber: z.string() }))
    .query(async ({ input }) => {
      if (!CH_API_KEY) {
        return { company: null, message: 'API key not configured' };
      }

      const data = await chRequest(`/company/${input.companyNumber}`);
      if (!data) return { company: null, message: 'Company not found' };

      return {
        company: {
          companyNumber: data.company_number,
          companyName: data.company_name,
          companyStatus: data.company_status,
          companyType: data.type,
          dateOfCreation: data.date_of_creation,
          address: formatCHAddress(data.registered_office_address),
          addressObj: data.registered_office_address ? {
            line1: [data.registered_office_address.premises, data.registered_office_address.address_line_1].filter(Boolean).join(' '),
            line2: data.registered_office_address.address_line_2 || '',
            city: data.registered_office_address.locality || '',
            county: data.registered_office_address.region || '',
            postcode: data.registered_office_address.postal_code || '',
            country: data.registered_office_address.country || 'United Kingdom',
          } : null,
          sicCodes: data.sic_codes || [],
          jurisdiction: data.jurisdiction,
          hasCharges: data.has_charges,
          hasInsolvencyHistory: data.has_insolvency_history,
        },
        message: null,
      };
    }),

  officers: protectedProcedure
    .input(z.object({ companyNumber: z.string() }))
    .query(async ({ input }) => {
      if (!CH_API_KEY) {
        return { officers: [], message: 'API key not configured' };
      }

      const data = await chRequest(`/company/${input.companyNumber}/officers`);
      if (!data?.items) return { officers: [], message: null };

      return {
        officers: data.items.map((o: any) => ({
          name: o.name,
          role: o.officer_role,
          appointedOn: o.appointed_on,
          resignedOn: o.resigned_on,
          nationality: o.nationality,
          occupation: o.occupation,
          address: formatCHAddress(o.address),
        })),
        message: null,
      };
    }),

  validate: protectedProcedure
    .input(z.object({ companyNumber: z.string() }))
    .query(async ({ input }) => {
      const formatValid = isValidCompanyNumber(input.companyNumber);
      
      if (!formatValid) {
        return {
          valid: false,
          formatValid: false,
          exists: false,
          message: 'Invalid format. UK company numbers are 8 digits (e.g. 12345678) or 2 letters + 6 digits (e.g. SC123456).',
        };
      }

      if (!CH_API_KEY) {
        return {
          valid: true,
          formatValid: true,
          exists: null,
          message: 'Format valid. Cannot verify with Companies House (API key not configured).',
        };
      }

      const data = await chRequest(`/company/${input.companyNumber}`);
      
      return {
        valid: !!data,
        formatValid: true,
        exists: !!data,
        companyName: data?.company_name || null,
        companyStatus: data?.company_status || null,
        message: data ? `${data.company_name} (${data.company_status})` : 'Company not found at Companies House.',
      };
    }),
});

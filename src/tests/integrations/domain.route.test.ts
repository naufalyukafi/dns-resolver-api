import domainService from '@services/domain.service';
import dns from 'dns';
import Domain from '@models/domain.model';

jest.mock('dns', () => ({
  promises: {
    resolveTxt: jest.fn(),
  },
}));
jest.mock('@models/domain.model');


describe('domain service test', () => {
  it('should return valid SPF record when "v=spf1" is found', async () => {
    const domain = 'example.com';

    // Mock DNS response with TXT record containing "v=spf1"
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValue([['v=spf1 include:_spf.google.com ~all']]);

    const result = await domainService.spfCheck(domain);

    // Verify the result
    expect(result.valid).toBe(true);
    expect(result.record).toEqual([['v=spf1 include:_spf.google.com ~all']]);
  });

  it('should return invalid SPF record when no "v=spf1" is found', async () => {
    const domain = 'example.com';

    // Mock DNS response without TXT record containing "v=spf1"
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValue([['v=dkim1; p=']]);

    const result = await domainService.spfCheck(domain);

    // Verify the result
    expect(result.valid).toBe(false);
    expect(result.record).toEqual([]);
  });

  it('should handle DKIM records correctly for Microsoft and Google Workspace domains', async () => {
    const microsoftDomain = 'example.onmicrosoft.com';
    const googleDomain = 'example.googlemail.com';

    (dns.promises.resolveTxt as jest.Mock).mockResolvedValueOnce([['v=DKIM1; p=']]);
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValueOnce([['v=DKIM1; p=']]);

    const microsoftDkim = await domainService.dkimCheck(microsoftDomain);
    const googleDkim = await domainService.dkimCheck(googleDomain);

    // Verify Microsoft DKIM
    expect(microsoftDkim.valid).toBe(true);
    expect(microsoftDkim.record).toEqual([['v=DKIM1; p=']]);

    // Verify Google Workspace DKIM
    expect(googleDkim.valid).toBe(true);
    expect(googleDkim.record).toEqual([['v=DKIM1; p=']]);
  });

  it('should check and return valid DMARC record when "v=DMARC1" is found', async () => {
    const domain = 'example.com';

    // Mock DNS response with DMARC record containing "v=DMARC1"
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValue([['v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com']]);

    const result = await domainService.dmarcCheck(domain);

    // Verify the result
    expect(result.valid).toBe(true);
    expect(result.record).toEqual([['v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com']]);
  });

  it('should return invalid DMARC record when no "v=DMARC1" is found', async () => {
    const domain = 'example.com';

    // Mock DNS response without DMARC record
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValue([['v=spf1 include:_spf.google.com ~all']]);

    const result = await domainService.dmarcCheck(domain);

    // Verify the result
    expect(result.valid).toBe(false);
    expect(result.record).toEqual([]);
  });

  it('should check valid SPF, DKIM, and DMARC records for a real domain', async () => {
    const domainName = 'gmail.com'; // Example of a real domain (Google's domain)

    // Mock real DNS records for Gmail
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValueOnce([['v=spf1 include:_spf.google.com ~all']]);
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValueOnce([['v=DKIM1; p=']]);
    (dns.promises.resolveTxt as jest.Mock).mockResolvedValueOnce([['v=DMARC1; p=none; rua=mailto:dmarc-reports@google.com']]);

    const spf = await domainService.spfCheck(domainName);
    const dkim = await domainService.dkimCheck(domainName);
    const dmarc = await domainService.dmarcCheck(domainName);

    // Verify SPF, DKIM, and DMARC results for gmail.com
    expect(spf.valid).toBe(true);
    expect(spf.record).toEqual([['v=spf1 include:_spf.google.com ~all']]);

    expect(dkim.valid).toBe(true);
    expect(dkim.record).toEqual([['v=DKIM1; p=']]);

    expect(dmarc.valid).toBe(true);
    expect(dmarc.record).toEqual([['v=DMARC1; p=none; rua=mailto:dmarc-reports@google.com']]);
  });
});

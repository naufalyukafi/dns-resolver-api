import Domain from "@models/domain.model";
import ApiError from "@utils/ApiError";
import httpStatus from 'http-status';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

async function spfCheck(domain: string) {
  try {
    const response = await dns.promises.resolveTxt(domain);
    const spfRecord = response.filter((record: any) =>
      record.some((data: string) => data.includes('v=spf1'))
    );
    return { valid: spfRecord.length > 0, record: spfRecord };
  } catch (error) {
    console.error(`Error checking SPF for domain ${domain}:`, error);
    return { valid: false, record: null };
  }
}

async function dkimCheck(domain: string) {
  try {
    const isDomainMicrosoft = domain.endsWith('.onmicrosoft.com');
    const isDomainGoogleWorkspace = domain.endsWith('.googlemail.com') || domain.endsWith('.gmail.com');

    let dkimSelector = 'default';
    if (isDomainMicrosoft) {
      dkimSelector = 'selector1';
    } else if (isDomainGoogleWorkspace) {
      dkimSelector = 'google';
    }

    const dkimDomain = `${dkimSelector}._domainkey.${domain}`;
    const response = await dns.promises.resolveTxt(dkimDomain);
    const dkimRecord = response.filter((record: any) =>
      record.some((data: string) => data.includes('v=DKIM1'))
    );
    return { valid: dkimRecord.length > 0, record: dkimRecord };
  } catch (error) {
    console.log(`No DKIM record found for domain ${domain}, saving with null DKIM.`);
    return { valid: false, record: null };
  }
}

async function dmarcCheck(domain: string) {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const response = await dns.promises.resolveTxt(dmarcDomain);
    const dmarcRecord = response.filter((record: any) =>
      record.some((data: string) => data.includes('v=DMARC1'))
    );
    return { valid: dmarcRecord.length > 0, record: dmarcRecord };
  } catch (error) {
    console.error(`Error checking DMARC for domain ${domain}:`, error);
    return { valid: false, record: null };
  }
}

async function checkAndSaveDomain(domainName: string) {
  try {
    console.log(`Checking DNS records for ${domainName}`);

    const spf = await spfCheck(domainName);
    console.log('SPF Check Result:', spf);

    let dkim = await dkimCheck(domainName);
    console.log('DKIM Check Result:', dkim);

    const dmarc = await dmarcCheck(domainName);
    console.log('DMARC Check Result:', dmarc);

    // Flatten the records if they are arrays of arrays
    const spfRecord = spf.record ? spf.record.flat() : [];
    const dkimRecord = dkim.record;
    const dmarcRecord = dmarc.record ? dmarc.record.flat() : [];

    // Save or update the domain record in the database
    console.log(`Saving domain ${domainName} to the database`);

    const domain = await Domain.findOneAndUpdate(
      { name: domainName },
      {
        name: domainName,
        spf: { valid: spf.valid, record: spfRecord },
        dkim: { valid: dkim.valid, record: dkimRecord },
        dmarc: { valid: dmarc.valid, record: dmarcRecord },
      },
      { new: true, upsert: true }
    );

    console.log('Domain saved successfully:', domain);
    return domain;
  } catch (error) {
    console.error(`Error saving domain ${domainName}:`, error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error saving domain data');
  }
}

async function processDomainsFromCsv(filePath: string) {
  return new Promise((resolve, reject) => {
    const domains: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: any) => {
        const domain = Object.values(row)[0];
        domains.push(domain as any);
      })
      .on('end', async () => {
        try {
          // Proses domain secara paralel
          const results = await Promise.all(domains.map(checkAndSaveDomain));
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: any) => {
        reject(error);
      });
  });
}

async function checkAndUpdateDomainRecords() {
  try {
    const csvPath = path.join(__dirname, '../data/domain_names.csv');
    const domains = await processDomainsFromCsv(csvPath) as any;

    const saveResults = await Promise.all(domains?.map(checkAndSaveDomain));

    const failedDomains = saveResults.filter((result) => !result);
    if (failedDomains.length > 0) {
      console.error(`Failed to save ${failedDomains.length} domain(s).`);
    } else {
      console.log("All domain records have been checked and updated.");
    }
  } catch (error) {
    console.error("Error updating domain records:", error);
  }
}

async function getDomains(options) {
  try {
    const { name, spfValid, dkimValid, dmarcValid, page = 1, limit = 5 } = options;

    const query: any = {};

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }
    if (spfValid !== undefined) {
      query['spf.valid'] = spfValid === 'true';
    }
    if (dkimValid !== undefined) {
      query['dkim.valid'] = dkimValid === 'true';
    }
    if (dmarcValid !== undefined) {
      query['dmarc.valid'] = dmarcValid === 'true';
    }

    const skip = (page - 1) * limit;

    const domains = await Domain.find(query)
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Domain.countDocuments(query);

    return {
      results: domains,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalResults: totalCount,
    };
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching domains');
  }
}

export default {
  spfCheck,
  dkimCheck,
  dmarcCheck,
  checkAndSaveDomain,
  checkAndUpdateDomainRecords,
  getDomains
};

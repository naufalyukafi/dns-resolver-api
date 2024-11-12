import Domain from "@models/domain.model";
import domainService from "@services/domain.service";
import ApiError from "@utils/ApiError";
import catchAsync from "@utils/catchAsync";
import pick from "@utils/pick";
import httpStatus from "http-status";

async function checkDomain(req, res) {
  const { domains } = req.body;
  if (!domains || !Array.isArray(domains)) {
    return res.status(400).json({ error: 'Daftar domain harus disediakan dalam bentuk array.' });
  }

  try {
    const results = await Promise.all(domains.map(domainService.checkAndSaveDomain));
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan dalam pengecekan domain.' });
  }
}

// Controller untuk mendapatkan hasil pengecekan semua domain
async function getAllDomains(req, res) {
  try {
    const domains = await Domain.find({});
    return res.status(200).json(domains);
  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan dalam pengambilan data domain.' });
  }
}

export const getDomains = catchAsync(async (req, res) => {
  try {
    const options = pick(req.query, ['limit', 'page', 'name', 'spfValid', 'dkimValid', 'dmarcValid']);

    const result = await domainService.getDomains(options);

    res.send(result);
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Domains not found');
  }
});

export const runManualDomainUpdate = async (req, res) => {
  try {
    await domainService.checkAndUpdateDomainRecords();
    res.status(200).json({ message: 'Pembaruan domain berhasil dilakukan secara manual.' });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan saat memperbarui domain.');
  }
};

export default {
  checkDomain,
  getAllDomains,
  getDomains,
  runManualDomainUpdate,
};

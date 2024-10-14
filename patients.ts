import { Payload } from '@/types/Request';
import { Patient } from '@/types/Response/Patient';
import { Option } from '@/types/UI';
import toast from '@/utils/toast';
import { CheckupStageRoot } from '@/types/Response/Response';
import core from './core';
import { GET, makeDownloadRequest } from '../api';

const { raiseToast, raiseCommonToast } = toast;
const ENTITY_PREFIX = '/patients';

async function getPatients(payload?: Payload) {
  const response = await core.getEntities(ENTITY_PREFIX, payload);
  const data = {
    count: response.count,
    entities: response.data.entities as Patient[],
  };
  return data;
}

async function deletePatient(patientId: string, certificateId: string) {
  const response = await core.deleteEntities(`/certificates/${certificateId}${ENTITY_PREFIX}/${patientId}`);
  return response;
}

async function getPatientsStatuses(payload?: Payload) {
  const fullUrl = `${ENTITY_PREFIX}/statuses`;
  const response = await core.getEntities(fullUrl, payload);
  const data = {
    count: response.count,
    entities: response.data.entities as Option[],
  };
  return data;
}

async function setPatientStatusAddition(patientId: string) {
  try {
    const fullUrl = `${ENTITY_PREFIX}/${patientId}/status/addition`;
    await core.putEntities(fullUrl);
    raiseCommonToast('success.any.update');
  } catch (error) {
    raiseCommonToast('error.any.update');
    throw error;
  }
}

async function changePatientStatus(patientId: string, payload: Payload, emitToast = true) {
  try {
    const fullUrl = `${ENTITY_PREFIX}/${patientId}`;
    await core.patchEntities(fullUrl, payload);
    if (emitToast) {
      raiseCommonToast('success.any.update');
    }
  } catch (error) {
    raiseCommonToast('error.any.update');
    throw error;
  }
}

async function changeCheckupStatus(patientId: string, serviceId: string, payload?: Payload) {
  try {
    const fullUrl = `${ENTITY_PREFIX}/${patientId}/services/${serviceId}`;
    await core.patchEntities(fullUrl, payload);
    raiseCommonToast('success.any.update');
  } catch (error) {
    raiseCommonToast('error.any.update');
    throw error;
  }
}

async function uploadPatientFile(patientId: string, target: string, file: File) {
  const fullUrl = `${ENTITY_PREFIX}/${patientId}/files/${target}`;
  const data = new FormData();
  data.append(target, file);
  const payload: Payload = {
    body: data,
  };
  try {
    await core.postEntities(fullUrl, payload);
    raiseCommonToast('success.file.upload');
  } catch (error) {
    raiseCommonToast('error.file.upload');
    throw error;
  }
}

async function downloadPatientFile(patientId: string, target: string) {
  const fullUrl = `${ENTITY_PREFIX}/${patientId}/files/${target}`;
  try {
    return await makeDownloadRequest(GET, fullUrl);
  } catch (error) {
    raiseCommonToast('error.file.download');
    throw error;
  }
}

async function deletePatientFile(patientId: string, target: string) {
  const fullUrl = `${ENTITY_PREFIX}/${patientId}/files/${target}`;
  await core.deleteEntities(fullUrl);
}

async function uploadCheckups(file: File) {
  const fullUrl = `${ENTITY_PREFIX}/upload_checkups`;
  const data = new FormData();
  data.append('patients_checkup_file', file);
  const payload: Payload = {
    body: data,
  };
  try {
    await core.postEntities(fullUrl, payload);
    raiseCommonToast('success.file.upload');
  } catch (error) {
    raiseCommonToast('error.file.upload');
    throw error;
  }
}

async function createCheckupStage(patientId: string, serviceId: string, payload?: Payload) {
  const fullUrl = `${ENTITY_PREFIX}/${patientId}/services/${serviceId}/create_any_stage`;
  const formData = new FormData();

  if (payload?.body) {
    const keys = Object.keys(payload.body);
    const values = Object.values(payload.body);

    keys.forEach((key, index) => {
      const value = String(values[index]);
      formData.append(key, value);
    });
  }

  const newPayload: Payload = {
    body: formData,
  };

  try {
    const response = await core.postEntities(fullUrl, newPayload);
    raiseCommonToast('success.any.update');
    return response as CheckupStageRoot;
  } catch (error) {
    const response: { errors: string } = (await ((error as { response: Response }).response as Response).json()) as {
      errors: string;
    };
    if ('errors' in response && response.errors) {
      raiseToast(response.errors, 'error');
    } else {
      raiseCommonToast('error.any.update');
    }
    throw error;
  }
}

async function changeCheckupStage(patientId: string, stageId: string, payload?: Payload) {
  const fullUrl = `${ENTITY_PREFIX}/${patientId}/stages/${stageId}`;

  try {
    await core.patchEntities(fullUrl, payload);
    raiseCommonToast('success.any.update');
  } catch (error) {
    raiseCommonToast('error.any.update');
    throw error;
  }
}

export default {
  getPatients,
  deletePatient,
  changeCheckupStatus,
  setPatientStatusAddition,
  changePatientStatus,
  getPatientsStatuses,
  uploadPatientFile,
  downloadPatientFile,
  deletePatientFile,
  uploadCheckups,
  createCheckupStage,
  changeCheckupStage,
};

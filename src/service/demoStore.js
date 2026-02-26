const STORAGE_KEY = "genaccess_demo_store_v1";

const seedData = {
  unitTypes: [
    { id: 1, name: "Apartamento", is_active: true, condominium_id: 1 },
    { id: 2, name: "Penthouse", is_active: true, condominium_id: 1 },
    { id: 3, name: "Oficina", is_active: true, condominium_id: 1 },
  ],
  apartments: [
    {
      id: 1,
      condominium_id: 1,
      unit_type_id: 1,
      unit_type: { id: 1, name: "Apartamento" },
      unitType: { id: 1, name: "Apartamento" },
      tower: "Torre A",
      floor: 3,
      number: "301",
      is_active: true,
      residents: [{ id: 1 }],
    },
    {
      id: 2,
      condominium_id: 1,
      unit_type_id: 1,
      unit_type: { id: 1, name: "Apartamento" },
      unitType: { id: 1, name: "Apartamento" },
      tower: "Torre A",
      floor: 6,
      number: "602",
      is_active: true,
      residents: [],
    },
    {
      id: 3,
      condominium_id: 1,
      unit_type_id: 2,
      unit_type: { id: 2, name: "Penthouse" },
      unitType: { id: 2, name: "Penthouse" },
      tower: "Torre B",
      floor: 12,
      number: "1201",
      is_active: true,
      residents: [{ id: 2 }],
    },
    {
      id: 4,
      condominium_id: 1,
      unit_type_id: 1,
      unit_type: { id: 1, name: "Apartamento" },
      unitType: { id: 1, name: "Apartamento" },
      tower: "Torre B",
      floor: 5,
      number: "503",
      is_active: true,
      residents: [],
    },
    {
      id: 5,
      condominium_id: 1,
      unit_type_id: 3,
      unit_type: { id: 3, name: "Oficina" },
      unitType: { id: 3, name: "Oficina" },
      tower: "Torre C",
      floor: 2,
      number: "204",
      is_active: false,
      residents: [],
    },
  ],
  users: [
    {
      id: 1,
      full_name: "Julián Gómez",
      document_number: "1012456789",
      email: "julian.gomez@genaccess.demo",
      phone: "3001234567",
      birth_date: "1990-05-12",
      is_active: true,
      roles: [{ id: 2, name: "administrador" }],
      condominium_id: 1,
    },
    {
      id: 2,
      full_name: "Laura Méndez",
      document_number: "1004567890",
      email: "laura.mendez@genaccess.demo",
      phone: "3009876543",
      birth_date: "1988-02-21",
      is_active: true,
      roles: [{ id: 3, name: "seguridad" }],
      condominium_id: 1,
      operative: { is_active: true },
    },
    {
      id: 3,
      full_name: "Pedro Castillo",
      document_number: "1023456789",
      email: "pedro.castillo@genaccess.demo",
      phone: "3014567890",
      birth_date: "1993-11-03",
      is_active: true,
      roles: [{ id: 4, name: "aseo" }],
      condominium_id: 1,
      operative: { is_active: true },
    },
    {
      id: 4,
      full_name: "Andrea López",
      document_number: "1009876543",
      email: "andrea.lopez@genaccess.demo",
      phone: "3023456789",
      birth_date: "1995-07-18",
      is_active: false,
      roles: [{ id: 6, name: "residente" }],
      condominium_id: 1,
      resident: { is_active: false },
    },
  ],
  vehicleTypes: [
    { id: 1, name: "Automóvil", is_active: true, condominium_id: 1 },
    { id: 2, name: "Motocicleta", is_active: true, condominium_id: 1 },
    { id: 3, name: "Camioneta", is_active: true, condominium_id: 1 },
    { id: 4, name: "Visitante", is_active: true, condominium_id: 1 },
  ],
  vehicles: [
    {
      id: 1,
      condominium_id: 1,
      vehicle_type_id: 1,
      apartment_id: 1,
      plate: "KLM123",
      owner_type: "resident",
      is_active: true,
    },
  ],
  vehicleEntries: [
    {
      id: 1,
      condominium_id: 1,
      vehicle_id: 1,
      status: "active",
      created_at: new Date().toISOString(),
      vehicle: {
        id: 1,
        plate: "KLM123",
        owner_type: "resident",
        apartment_id: 1,
        apartment: { id: 1, number: "301" },
      },
    },
  ],
  visits: [
    {
      id: 1,
      condominium_id: 1,
      full_name: "Mariana Ríos",
      document_number: "1002233445",
      apartment_id: 2,
      apartment_name: "Torre A - Apto 602",
      status: "active",
      created_at: new Date().toISOString(),
    },
  ],
  correspondences: [
    {
      id: 1,
      condominium_id: 1,
      courier: "Servientrega",
      unit_label: "Apto 402",
      type: "Documento",
      receiver: "Laura Méndez",
      notes: "Sobre cerrado",
      status: "pending",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      condominium_id: 1,
      courier: "Coordinadora",
      unit_label: "Apto 101",
      type: "Paquete",
      receiver: "Julián Gómez",
      notes: "Caja mediana",
      status: "delivered",
      created_at: new Date().toISOString(),
      delivered_at: new Date().toISOString(),
    },
  ],
  cleaningAreas: [
    { id: 1, condominium_id: 1, name: "Lobby", is_active: true },
    { id: 2, condominium_id: 1, name: "Ascensores", is_active: true },
    { id: 3, condominium_id: 1, name: "Parqueadero", is_active: false },
  ],
  cleaningChecklists: [
    { id: 1, cleaning_area_id: 1, item_name: "Desinfección de superficies", completed: false },
    { id: 2, cleaning_area_id: 1, item_name: "Revisión de papeleras", completed: false },
    { id: 3, cleaning_area_id: 2, item_name: "Limpieza de botones", completed: false },
  ],
  cleaningRecords: [
    {
      id: 1,
      condominium_id: 1,
      cleaning_area_id: 1,
      operative_id: 2,
      cleaning_area: { id: 1, name: "Lobby" },
      operative: { user: { full_name: "Laura Méndez" } },
      status: "pending",
      observations: "",
      created_at: new Date().toISOString(),
    },
  ],
  lastIds: {
    unitTypes: 3,
    apartments: 5,
    users: 4,
    vehicleTypes: 4,
    vehicles: 1,
    vehicleEntries: 1,
    visits: 1,
    correspondences: 2,
    cleaningAreas: 3,
    cleaningChecklists: 3,
    cleaningRecords: 1,
  },
};

function loadStore() {
  if (typeof window === "undefined") return { ...seedData };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return structuredClone(seedData);
  }
  try {
    const parsed = JSON.parse(raw);
    const merged = {
      ...seedData,
      ...parsed,
      lastIds: {
        ...seedData.lastIds,
        ...(parsed.lastIds || {}),
      },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return structuredClone(seedData);
  }
}

function saveStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function nextId(store, key) {
  store.lastIds[key] += 1;
  return store.lastIds[key];
}

function demoResponse(data) {
  return Promise.resolve({ data });
}

export function demoFetchUnitTypes(condominiumId) {
  const store = loadStore();
  const data = store.unitTypes.filter((u) => u.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoCreateUnitType(data) {
  const store = loadStore();
  const id = nextId(store, "unitTypes");
  const item = { id, ...data };
  store.unitTypes.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoUpdateUnitType(id, data) {
  const store = loadStore();
  const index = store.unitTypes.findIndex((u) => u.id === Number(id));
  if (index >= 0) {
    store.unitTypes[index] = { ...store.unitTypes[index], ...data };
    saveStore(store);
  }
  return demoResponse(store.unitTypes[index] || null);
}

export function demoDeactivateUnitType(id) {
  const store = loadStore();
  const unit = store.unitTypes.find((u) => u.id === Number(id));
  if (unit) unit.is_active = false;
  saveStore(store);
  return demoResponse(unit || null);
}

export function demoFetchApartments(condominiumId) {
  const store = loadStore();
  const data = store.apartments.filter((a) => a.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoGetApartment(id) {
  const store = loadStore();
  const item = store.apartments.find((a) => a.id === Number(id));
  return demoResponse(item || null);
}

export function demoCreateApartment(data) {
  const store = loadStore();
  const id = nextId(store, "apartments");
  const unitType = store.unitTypes.find((u) => u.id === Number(data.unit_type_id));
  const item = {
    id,
    residents: [],
    unit_type: unitType ? { id: unitType.id, name: unitType.name } : null,
    unitType: unitType ? { id: unitType.id, name: unitType.name } : null,
    ...data,
  };
  store.apartments.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoUpdateApartment(id, data) {
  const store = loadStore();
  const index = store.apartments.findIndex((a) => a.id === Number(id));
  if (index >= 0) {
    const unitType = data.unit_type_id
      ? store.unitTypes.find((u) => u.id === Number(data.unit_type_id))
      : null;
    store.apartments[index] = {
      ...store.apartments[index],
      ...data,
      unit_type: unitType
        ? { id: unitType.id, name: unitType.name }
        : store.apartments[index].unit_type,
      unitType: unitType
        ? { id: unitType.id, name: unitType.name }
        : store.apartments[index].unitType,
    };
    saveStore(store);
  }
  return demoResponse(store.apartments[index] || null);
}

export function demoDeactivateApartment(id) {
  const store = loadStore();
  const item = store.apartments.find((a) => a.id === Number(id));
  if (item) item.is_active = false;
  saveStore(store);
  return demoResponse(item || null);
}

export function demoFetchUsers(condominiumId) {
  const store = loadStore();
  const data = store.users.filter((u) => u.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoGetUser(id) {
  const store = loadStore();
  const item = store.users.find((u) => u.id === Number(id));
  return demoResponse(item || null);
}

export function demoCreateUser(data) {
  const store = loadStore();
  const id = nextId(store, "users");
  const role = data.role_id
    ? { id: Number(data.role_id), name: roleNameById(Number(data.role_id)) }
    : { id: 0, name: "sin rol" };
  const item = {
    id,
    roles: [role],
    ...data,
  };
  store.users.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoUpdateUser(id, data) {
  const store = loadStore();
  const index = store.users.findIndex((u) => u.id === Number(id));
  if (index >= 0) {
    store.users[index] = { ...store.users[index], ...data };
    saveStore(store);
  }
  return demoResponse(store.users[index] || null);
}

export function demoDeactivateUser(id) {
  const store = loadStore();
  const item = store.users.find((u) => u.id === Number(id));
  if (item) item.is_active = false;
  saveStore(store);
  return demoResponse(item || null);
}

export function demoFetchVehicleTypes(condominiumId) {
  const store = loadStore();
  const data = store.vehicleTypes.filter((v) => v.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoCreateVehicleType(data) {
  const store = loadStore();
  const id = nextId(store, "vehicleTypes");
  const item = { id, ...data };
  store.vehicleTypes.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoUpdateVehicleType(id, data) {
  const store = loadStore();
  const index = store.vehicleTypes.findIndex((v) => v.id === Number(id));
  if (index >= 0) {
    store.vehicleTypes[index] = { ...store.vehicleTypes[index], ...data };
    saveStore(store);
  }
  return demoResponse(store.vehicleTypes[index] || null);
}

export function demoDeactivateVehicleType(id) {
  const store = loadStore();
  const item = store.vehicleTypes.find((v) => v.id === Number(id));
  if (item) item.is_active = false;
  saveStore(store);
  return demoResponse(item || null);
}

export function demoFetchOperatives(condominiumId) {
  const store = loadStore();
  const data = store.users
    .filter((u) => u.condominium_id === condominiumId)
    .filter((u) => u.roles?.[0]?.name === "aseo" || u.roles?.[0]?.name === "seguridad")
    .map((u) => ({
      id: u.id,
      user: { full_name: u.full_name, name: u.full_name },
      position: u.roles?.[0]?.name || "Operativo",
    }));
  return Promise.resolve(data);
}

export function demoFetchSecurityUsers(condominiumId) {
  const store = loadStore();
  const data = store.users
    .filter((u) => u.condominium_id === condominiumId)
    .filter((u) => u.roles?.[0]?.name === "seguridad")
    .map((u) => ({
      id: u.id,
      full_name: u.full_name,
    }));
  return Promise.resolve(data);
}

export function demoFetchVisits(condominiumId) {
  const store = loadStore();
  const data = store.visits.filter((v) => v.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoCreateVisit(data) {
  const store = loadStore();
  const id = nextId(store, "visits");
  const apartment = store.apartments.find(
    (a) => a.id === Number(data.apartment_id)
  );
  const item = {
    id,
    status: "active",
    created_at: new Date().toISOString(),
    apartment_name: apartment
      ? `${apartment.tower} - Apto ${apartment.number}`
      : data.destination || "",
    ...data,
  };
  store.visits.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoCheckoutVisit(id) {
  const store = loadStore();
  const visit = store.visits.find((v) => v.id === Number(id));
  if (visit) visit.status = "closed";
  saveStore(store);
  return demoResponse(visit || null);
}

export function demoFetchCorrespondences(condominiumId) {
  const store = loadStore();
  const data = store.correspondences.filter(
    (c) => c.condominium_id === condominiumId
  );
  return demoResponse(data);
}

export function demoCreateCorrespondence(data) {
  const store = loadStore();
  const id = nextId(store, "correspondences");
  const item = {
    id,
    status: "pending",
    created_at: new Date().toISOString(),
    ...data,
  };
  store.correspondences.unshift(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoDeliverCorrespondence(id) {
  const store = loadStore();
  const item = store.correspondences.find((c) => c.id === Number(id));
  if (item) {
    item.status = "delivered";
    item.delivered_at = new Date().toISOString();
  }
  saveStore(store);
  return demoResponse(item || null);
}

export function demoFetchCleaningAreas(condominiumId) {
  const store = loadStore();
  const data = store.cleaningAreas.filter((a) => a.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoCreateCleaningArea(condominiumId, name) {
  const store = loadStore();
  const id = nextId(store, "cleaningAreas");
  const item = { id, condominium_id: condominiumId, name, is_active: true };
  store.cleaningAreas.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoUpdateCleaningAreaName(areaId, newName) {
  const store = loadStore();
  const area = store.cleaningAreas.find((a) => a.id === Number(areaId));
  if (area) area.name = newName;
  saveStore(store);
  return demoResponse(area || null);
}

export function demoToggleCleaningAreaActive(areaId, currentState) {
  const store = loadStore();
  const area = store.cleaningAreas.find((a) => a.id === Number(areaId));
  if (area) area.is_active = !currentState;
  saveStore(store);
  return demoResponse(area || null);
}

export function demoFetchChecklistForArea(areaId) {
  const store = loadStore();
  const data = store.cleaningChecklists.filter(
    (c) => c.cleaning_area_id === Number(areaId)
  );
  return demoResponse(data);
}

export function demoAddChecklistTask(areaId, text) {
  const store = loadStore();
  const id = nextId(store, "cleaningChecklists");
  const item = {
    id,
    cleaning_area_id: Number(areaId),
    item_name: text,
    completed: false,
  };
  store.cleaningChecklists.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoRemoveChecklistTask(id) {
  const store = loadStore();
  store.cleaningChecklists = store.cleaningChecklists.filter(
    (c) => c.id !== Number(id)
  );
  saveStore(store);
  return demoResponse(true);
}

export function demoFetchCleaningRecords(condominiumId) {
  const store = loadStore();
  const data = store.cleaningRecords.filter(
    (r) => r.condominium_id === condominiumId
  );
  return demoResponse(data);
}

export function demoCreateCleaningRecord(payload) {
  const store = loadStore();
  const id = nextId(store, "cleaningRecords");
  const area = store.cleaningAreas.find((a) => a.id === Number(payload.cleaning_area_id));
  const operative = store.users.find((u) => u.id === Number(payload.operative_id));
  const item = {
    id,
    condominium_id: payload.condominium_id,
    cleaning_area_id: payload.cleaning_area_id,
    operative_id: payload.operative_id,
    cleaning_area: area ? { id: area.id, name: area.name } : null,
    operative: operative ? { user: { full_name: operative.full_name } } : null,
    status: "pending",
    observations: "",
    created_at: new Date().toISOString(),
  };
  store.cleaningRecords.unshift(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoGetChecklistItems(recordId) {
  const store = loadStore();
  const record = store.cleaningRecords.find((r) => r.id === Number(recordId));
  if (!record) return demoResponse([]);
  const items = store.cleaningChecklists
    .filter((c) => c.cleaning_area_id === Number(record.cleaning_area_id))
    .map((c) => ({ ...c }));
  return demoResponse(items);
}

export function demoToggleChecklistItem(id) {
  const store = loadStore();
  const item = store.cleaningChecklists.find((c) => c.id === Number(id));
  if (item) item.completed = !item.completed;
  saveStore(store);
  return demoResponse(item || null);
}

export function demoCompleteCleaningRecord(recordId, data) {
  const store = loadStore();
  const record = store.cleaningRecords.find((r) => r.id === Number(recordId));
  if (record) {
    record.status = "completed";
    record.observations = data?.observations || record.observations || "";
  }
  saveStore(store);
  return demoResponse(record || null);
}

export function demoFetchVehicles(condominiumId) {
  const store = loadStore();
  const data = store.vehicles.filter((v) => v.condominium_id === condominiumId);
  return demoResponse(data);
}

export function demoCreateVehicle(data) {
  const store = loadStore();
  const id = nextId(store, "vehicles");
  const item = { id, ...data };
  store.vehicles.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoFetchVehicleEntries(condominiumId) {
  const store = loadStore();
  const data = store.vehicleEntries.filter(
    (v) => v.condominium_id === condominiumId
  );
  return demoResponse(data);
}

export function demoCreateVehicleEntry(data) {
  const store = loadStore();
  const id = nextId(store, "vehicleEntries");
  const vehicle = store.vehicles.find((v) => v.id === Number(data.vehicle_id));
  const apartment = store.apartments.find((a) => a.id === Number(vehicle?.apartment_id));
  const item = {
    id,
    condominium_id: data.condominium_id,
    vehicle_id: data.vehicle_id,
    status: "active",
    created_at: new Date().toISOString(),
    vehicle: {
      id: vehicle?.id,
      plate: vehicle?.plate,
      owner_type: vehicle?.owner_type,
      apartment_id: vehicle?.apartment_id,
      apartment: apartment ? { id: apartment.id, number: apartment.number } : null,
    },
  };
  store.vehicleEntries.push(item);
  saveStore(store);
  return demoResponse(item);
}

export function demoCheckoutVehicleEntry(id) {
  const store = loadStore();
  const entry = store.vehicleEntries.find((v) => v.id === Number(id));
  if (entry) entry.status = "closed";
  saveStore(store);
  return demoResponse(entry || null);
}

function roleNameById(id) {
  const map = {
    2: "administrador",
    3: "seguridad",
    4: "aseo",
    5: "mantenimiento",
    6: "residente",
  };
  return map[id] || "sin rol";
}

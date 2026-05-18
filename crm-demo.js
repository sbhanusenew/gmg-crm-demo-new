const STORAGE_KEY = "gmg-crm-demo-store-v1";
const CURRENT_USER_KEY = "gmg-crm-demo-current-user";
const STAGE_OPTIONS = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];
const PRIORITY_OPTIONS = ["Cold", "Warm", "Hot"];
const SOURCE_OPTIONS = [
  "Website",
  "Referral",
  "Trade Show",
  "Cold Call",
  "WhatsApp",
  "LinkedIn",
];
const USER_ROLE_OPTIONS = [
  "Admin",
  "Sales Manager",
  "Sales Executive",
  "Business Development",
];
const USER_STATUS_OPTIONS = ["Active", "Inactive"];
const CLOSED_STAGES = new Set(["Won", "Lost"]);

let storageAvailable = true;
let memoryStore = null;
let userState = {
  currentUserId: "",
  selectedLeadId: null,
  createMessage: "",
  editorMessage: "",
};
let adminState = {
  stageFilter: "All",
  searchQuery: "",
  selectedLeadId: null,
  editorMessage: "",
  userMessage: "",
};

function createSeedUsers() {
  return [
    {
      id: "USR-01",
      fullName: "Ananya Rao",
      email: "ananya.rao@gmg.example",
      role: "Admin",
      department: "Revenue Operations",
      status: "Active",
      createdAt: "2026-05-01T09:00:00+05:30",
    },
    {
      id: "USR-02",
      fullName: "Rahul Singh",
      email: "rahul.singh@gmg.example",
      role: "Sales Manager",
      department: "Corporate Sales",
      status: "Active",
      createdAt: "2026-05-01T09:05:00+05:30",
    },
    {
      id: "USR-03",
      fullName: "Meera Kapoor",
      email: "meera.kapoor@gmg.example",
      role: "Sales Executive",
      department: "Inside Sales",
      status: "Active",
      createdAt: "2026-05-01T09:10:00+05:30",
    },
    {
      id: "USR-04",
      fullName: "Vivek Nair",
      email: "vivek.nair@gmg.example",
      role: "Business Development",
      department: "Field Sales",
      status: "Active",
      createdAt: "2026-05-01T09:15:00+05:30",
    },
  ];
}

function createSeedLeads() {
  return [
    {
      id: "LEAD-3001",
      companyName: "BlueWave Logistics",
      contactName: "Sonia Verma",
      email: "sonia.verma@bluewave.example",
      phone: "+91 9870001201",
      source: "Website",
      stage: "Qualified",
      priority: "Hot",
      estimatedValue: 1500000,
      probability: 65,
      ownerId: "USR-03",
      nextAction: "Share commercial proposal and case study.",
      followUpDate: "2026-05-15",
      lastNote: "Operations team wants pricing with delivery timeline.",
      createdBy: "Meera Kapoor",
      createdAt: "2026-05-09T11:00:00+05:30",
      updatedAt: "2026-05-12T16:15:00+05:30",
    },
    {
      id: "LEAD-3002",
      companyName: "Harbor Marine Systems",
      contactName: "Dinesh Patel",
      email: "dinesh.patel@harbor.example",
      phone: "+91 9820034512",
      source: "Referral",
      stage: "Proposal Sent",
      priority: "Warm",
      estimatedValue: 3200000,
      probability: 75,
      ownerId: "USR-04",
      nextAction: "Confirm technical clarification call.",
      followUpDate: "2026-05-16",
      lastNote: "Proposal submitted. Waiting for engineering review comments.",
      createdBy: "Vivek Nair",
      createdAt: "2026-05-07T10:20:00+05:30",
      updatedAt: "2026-05-12T12:10:00+05:30",
    },
    {
      id: "LEAD-3003",
      companyName: "Apex Industrial Projects",
      contactName: "Ritika Shah",
      email: "ritika.shah@apex.example",
      phone: "+91 9891008744",
      source: "LinkedIn",
      stage: "New Lead",
      priority: "Warm",
      estimatedValue: 950000,
      probability: 20,
      ownerId: "USR-03",
      nextAction: "Complete discovery call and need analysis.",
      followUpDate: "2026-05-13",
      lastNote: "First call done. Customer requested company profile.",
      createdBy: "Meera Kapoor",
      createdAt: "2026-05-11T14:00:00+05:30",
      updatedAt: "2026-05-11T14:20:00+05:30",
    },
    {
      id: "LEAD-3004",
      companyName: "Sterling Ports",
      contactName: "Arpit Desai",
      email: "arpit.desai@sterling.example",
      phone: "+91 9811147788",
      source: "Trade Show",
      stage: "Negotiation",
      priority: "Hot",
      estimatedValue: 4800000,
      probability: 85,
      ownerId: "USR-02",
      nextAction: "Review revised payment terms with finance.",
      followUpDate: "2026-05-14",
      lastNote: "Commercial terms under negotiation. Decision expected this week.",
      createdBy: "Rahul Singh",
      createdAt: "2026-05-06T09:45:00+05:30",
      updatedAt: "2026-05-12T18:05:00+05:30",
    },
    {
      id: "LEAD-3005",
      companyName: "Northstar Engineering",
      contactName: "Pooja Malhotra",
      email: "pooja.malhotra@northstar.example",
      phone: "+91 9820080011",
      source: "Cold Call",
      stage: "Won",
      priority: "Warm",
      estimatedValue: 2100000,
      probability: 100,
      ownerId: "USR-02",
      nextAction: "Transfer to implementation and onboarding.",
      followUpDate: "2026-05-20",
      lastNote: "PO received and handoff to operations completed.",
      createdBy: "Rahul Singh",
      createdAt: "2026-05-02T15:00:00+05:30",
      updatedAt: "2026-05-10T11:30:00+05:30",
    },
    {
      id: "LEAD-3006",
      companyName: "Coastal Energy Works",
      contactName: "Niharika Sethi",
      email: "niharika.sethi@coastal.example",
      phone: "+91 9807803210",
      source: "WhatsApp",
      stage: "Lost",
      priority: "Cold",
      estimatedValue: 700000,
      probability: 0,
      ownerId: "USR-04",
      nextAction: "Revisit after next budget cycle.",
      followUpDate: "2026-08-01",
      lastNote: "Lost on price. Possible reopen after 3 months.",
      createdBy: "Vivek Nair",
      createdAt: "2026-05-03T13:30:00+05:30",
      updatedAt: "2026-05-09T17:10:00+05:30",
    },
  ];
}

function createSeedData() {
  return {
    nextLeadNumber: 3007,
    nextUserNumber: 5,
    users: createSeedUsers(),
    leads: createSeedLeads(),
  };
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function cleanText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function normaliseLeadId(value) {
  return cleanText(value).toUpperCase();
}

function buildLeadId(number) {
  return `LEAD-${String(number).padStart(4, "0")}`;
}

function buildUserId(number) {
  return `USR-${String(number).padStart(2, "0")}`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(new Date(value));
  } catch (error) {
    return String(value);
  }
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (error) {
    return String(value);
  }
}

function formatCurrency(value) {
  const amount = Number(value) || 0;

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    return `INR ${amount}`;
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDueLead(lead) {
  return (
    Boolean(lead.followUpDate) &&
    !CLOSED_STAGES.has(lead.stage) &&
    lead.followUpDate <= getTodayKey()
  );
}

function stageClass(stage) {
  return {
    "New Lead": "badge--new",
    Contacted: "badge--contacted",
    Qualified: "badge--qualified",
    "Proposal Sent": "badge--proposal",
    Negotiation: "badge--negotiation",
    Won: "badge--won",
    Lost: "badge--lost",
  }[stage] || "badge--new";
}

function priorityClass(priority) {
  return {
    Cold: "badge--cold",
    Warm: "badge--warm",
    Hot: "badge--hot",
  }[priority] || "badge--warm";
}

function userStatusClass(status) {
  return status === "Inactive" ? "badge--inactive" : "badge--active";
}

function badgeHtml(label, className) {
  return `<span class="badge ${className}">${escapeHtml(label)}</span>`;
}

function normaliseUser(user, fallbackId) {
  return {
    id: cleanText(user.id) || fallbackId,
    fullName: cleanText(user.fullName) || "Unnamed User",
    email: cleanText(user.email) || "no-email@example.com",
    role: USER_ROLE_OPTIONS.includes(user.role) ? user.role : "Sales Executive",
    department: cleanText(user.department) || "Sales",
    status: USER_STATUS_OPTIONS.includes(user.status) ? user.status : "Active",
    createdAt: user.createdAt || new Date().toISOString(),
  };
}

function resolveOwner(users, ownerId) {
  const matched = users.find((user) => user.id === ownerId && user.status === "Active");
  if (matched) {
    return matched;
  }

  return (
    users.find((user) => user.status === "Active" && user.role !== "Admin") ||
    users.find((user) => user.status === "Active") ||
    users[0]
  );
}

function normaliseLead(lead, fallbackId, users) {
  const owner = resolveOwner(users, cleanText(lead.ownerId));
  const safeStage = STAGE_OPTIONS.includes(lead.stage) ? lead.stage : "New Lead";
  let probability = Math.max(0, Math.min(100, Number(lead.probability) || 0));

  if (safeStage === "Won") {
    probability = 100;
  }

  if (safeStage === "Lost") {
    probability = 0;
  }

  return {
    id: normaliseLeadId(lead.id || fallbackId),
    companyName: cleanText(lead.companyName) || "Unnamed Company",
    contactName: cleanText(lead.contactName) || "Unknown Contact",
    email: cleanText(lead.email) || "contact@example.com",
    phone: cleanText(lead.phone),
    source: SOURCE_OPTIONS.includes(lead.source) ? lead.source : "Website",
    stage: safeStage,
    priority: PRIORITY_OPTIONS.includes(lead.priority) ? lead.priority : "Warm",
    estimatedValue: Math.max(0, Number(lead.estimatedValue) || 0),
    probability,
    ownerId: owner?.id || "",
    ownerName: owner?.fullName || "Unassigned",
    nextAction: cleanText(lead.nextAction) || "Plan next customer touchpoint.",
    followUpDate: cleanText(lead.followUpDate),
    lastNote: cleanText(lead.lastNote) || "No note added yet.",
    createdBy: cleanText(lead.createdBy) || owner?.fullName || "System",
    createdAt: lead.createdAt || new Date().toISOString(),
    updatedAt: lead.updatedAt || lead.createdAt || new Date().toISOString(),
  };
}

function normaliseStore(rawData) {
  const seed = createSeedData();
  const users = Array.isArray(rawData?.users)
    ? rawData.users.map((user, index) =>
        normaliseUser(user, buildUserId(index + 1)),
      )
    : seed.users.map((user) => normaliseUser(user, user.id));
  const leads = Array.isArray(rawData?.leads)
    ? rawData.leads.map((lead, index) =>
        normaliseLead(lead, buildLeadId(3001 + index), users),
      )
    : seed.leads.map((lead) => normaliseLead(lead, lead.id, users));
  const maxLeadNumber = leads.reduce((highest, lead) => {
    const match = lead.id.match(/(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : highest);
  }, 3006);
  const maxUserNumber = users.reduce((highest, user) => {
    const match = user.id.match(/(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : highest);
  }, 4);

  return {
    nextLeadNumber: Math.max(Number(rawData?.nextLeadNumber) || 0, maxLeadNumber + 1),
    nextUserNumber: Math.max(Number(rawData?.nextUserNumber) || 0, maxUserNumber + 1),
    users,
    leads,
  };
}

function readStore() {
  const seed = createSeedData();

  if (!storageAvailable) {
    if (!memoryStore) {
      memoryStore = cloneData(seed);
    }
    return cloneData(memoryStore);
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      const initial = normaliseStore(seed);
      writeStore(initial);
      return cloneData(initial);
    }

    const parsed = JSON.parse(rawValue);
    const normalised = normaliseStore(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalised)) {
      writeStore(normalised);
    }

    return cloneData(normalised);
  } catch (error) {
    storageAvailable = false;
    memoryStore = cloneData(seed);
    return cloneData(memoryStore);
  }
}

function writeStore(data) {
  const normalised = normaliseStore(data);

  if (!storageAvailable) {
    memoryStore = cloneData(normalised);
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalised));
  } catch (error) {
    storageAvailable = false;
    memoryStore = cloneData(normalised);
  }
}

function getSortedLeads(leads) {
  return [...leads].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });
}

function getStageBreakdown(leads) {
  return STAGE_OPTIONS.map((stage) => {
    const stageLeads = leads.filter((lead) => lead.stage === stage);
    const stageValue = stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

    return {
      stage,
      count: stageLeads.length,
      value: stageValue,
    };
  });
}

function getMetrics(leads, users) {
  const totalLeads = leads.length;
  const openLeads = leads.filter((lead) => !CLOSED_STAGES.has(lead.stage));
  const wonLeads = leads.filter((lead) => lead.stage === "Won");
  const hotLeads = leads.filter(
    (lead) => lead.priority === "Hot" && !CLOSED_STAGES.has(lead.stage),
  );
  const activeUsers = users.filter((user) => user.status === "Active");

  return {
    totalLeads,
    openValue: openLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0),
    wonCount: wonLeads.length,
    wonValue: wonLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0),
    hotLeads: hotLeads.length,
    activeUsers: activeUsers.length,
  };
}

function getCurrentUserId() {
  try {
    return cleanText(window.localStorage.getItem(CURRENT_USER_KEY));
  } catch (error) {
    return "";
  }
}

function setCurrentUserId(userId) {
  try {
    window.localStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (error) {
    return;
  }
}

function pickDefaultUser(users) {
  return (
    users.find((user) => user.status === "Active" && user.role === "Sales Executive") ||
    users.find((user) => user.status === "Active" && user.role === "Business Development") ||
    users.find((user) => user.status === "Active" && user.role === "Sales Manager") ||
    users.find((user) => user.status === "Active") ||
    users[0]
  );
}

function getLeadById(leadId) {
  return readStore().leads.find((lead) => lead.id === normaliseLeadId(leadId));
}

function createLead(payload, ownerId) {
  const data = readStore();
  const owner = resolveOwner(data.users, ownerId);
  const now = new Date().toISOString();
  const leadNumber = data.nextLeadNumber;
  const lead = normaliseLead(
    {
      id: buildLeadId(leadNumber),
      ...payload,
      stage: "New Lead",
      probability: 20,
      ownerId: owner?.id,
      createdBy: owner?.fullName || "System",
      createdAt: now,
      updatedAt: now,
    },
    buildLeadId(leadNumber),
    data.users,
  );

  data.leads.unshift(lead);
  data.nextLeadNumber = leadNumber + 1;
  writeStore(data);
  return lead;
}

function createUser(payload) {
  const data = readStore();
  const userNumber = data.nextUserNumber;
  const user = normaliseUser(
    {
      id: buildUserId(userNumber),
      ...payload,
      createdAt: new Date().toISOString(),
    },
    buildUserId(userNumber),
  );

  data.users.push(user);
  data.nextUserNumber = userNumber + 1;
  writeStore(data);
  return user;
}

function updateLead(leadId, updates) {
  const data = readStore();
  const normalisedId = normaliseLeadId(leadId);
  let updatedLead = null;

  data.leads = data.leads.map((lead) => {
    if (lead.id !== normalisedId) {
      return lead;
    }

    updatedLead = normaliseLead(
      {
        ...lead,
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      lead.id,
      data.users,
    );

    return updatedLead;
  });

  writeStore(data);
  return updatedLead;
}

function fillSelectOptions(select, options, includeAll = false) {
  if (!select) {
    return;
  }

  const values = includeAll ? ["All", ...options] : options;
  select.innerHTML = values
    .map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`)
    .join("");
}

function fillUserOptions(select, users) {
  if (!select) {
    return;
  }

  const options = users
    .filter((user) => user.status === "Active")
    .map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.fullName)} (${escapeHtml(user.role)})</option>`)
    .join("");

  select.innerHTML = options;
}

function leadLookupHtml(lead) {
  return `
    <div class="lookup-row">
      <div>
        <h3>${escapeHtml(lead.id)}</h3>
        <p>${escapeHtml(lead.companyName)} with ${escapeHtml(lead.contactName)}</p>
      </div>
      ${badgeHtml(lead.stage, stageClass(lead.stage))}
    </div>
    <p><strong>Owner:</strong> ${escapeHtml(lead.ownerName)}</p>
    <p><strong>Priority:</strong> ${escapeHtml(lead.priority)}</p>
    <p><strong>Next action:</strong> ${escapeHtml(lead.nextAction)}</p>
    <p><strong>Follow-up:</strong> ${escapeHtml(formatDate(lead.followUpDate))}</p>
    <p><strong>Updated:</strong> ${escapeHtml(formatDateTime(lead.updatedAt))}</p>
  `;
}

function renderEmptyRow(columnCount, message) {
  return `<tr><td colspan="${columnCount}">${escapeHtml(message)}</td></tr>`;
}

function renderSharedFooter() {
  const footerNote = document.querySelector("#shared-footer-note");
  if (!footerNote) {
    return;
  }

  footerNote.textContent = storageAvailable
    ? "This demo stores data locally in the browser. Use a real database and authentication before company rollout."
    : "Browser storage is limited in this session. Use a local web server for more reliable testing.";
}

function renderOverviewPage() {
  const refs = {
    totalLeads: document.querySelector("#overview-total-leads"),
    openValue: document.querySelector("#overview-open-value"),
    wonCount: document.querySelector("#overview-won-count"),
    activeUsers: document.querySelector("#overview-active-users"),
    stageGrid: document.querySelector("#overview-stage-grid"),
    table: document.querySelector("#overview-lead-table"),
  };

  const render = () => {
    const data = readStore();
    const leads = getSortedLeads(data.leads);
    const metrics = getMetrics(leads, data.users);
    const stages = getStageBreakdown(leads);

    refs.totalLeads.textContent = String(metrics.totalLeads);
    refs.openValue.textContent = formatCurrency(metrics.openValue);
    refs.wonCount.textContent = String(metrics.wonCount);
    refs.activeUsers.textContent = String(metrics.activeUsers);

    refs.stageGrid.innerHTML = stages
      .map((stage) => {
        return `
          <article class="stage-summary-card">
            <span class="eyebrow">${escapeHtml(stage.stage)}</span>
            <strong>${escapeHtml(String(stage.count))} leads</strong>
            <p>${escapeHtml(formatCurrency(stage.value))}</p>
          </article>
        `;
      })
      .join("");

    refs.table.innerHTML = leads.length
      ? leads
          .slice(0, 6)
          .map((lead) => {
            return `
              <tr>
                <td>${escapeHtml(lead.id)}</td>
                <td>${escapeHtml(lead.companyName)}</td>
                <td>${escapeHtml(lead.ownerName)}</td>
                <td>${badgeHtml(lead.stage, stageClass(lead.stage))}</td>
                <td>${escapeHtml(formatCurrency(lead.estimatedValue))}</td>
                <td>${escapeHtml(formatDate(lead.followUpDate))}</td>
              </tr>
            `;
          })
          .join("")
      : renderEmptyRow(6, "No leads available yet.");

    renderSharedFooter();
  };

  render();
  window.addEventListener("storage", render);
}

function renderUserPage() {
  const refs = {
    userSelector: document.querySelector("#user-selector"),
    myLeadCount: document.querySelector("#user-my-leads-count"),
    dueCount: document.querySelector("#user-due-count"),
    openValue: document.querySelector("#user-open-value"),
    wonCount: document.querySelector("#user-won-count"),
    createForm: document.querySelector("#lead-create-form"),
    createMessage: document.querySelector("#lead-create-message"),
    lookupForm: document.querySelector("#lead-lookup-form"),
    lookupInput: document.querySelector("#lead-lookup-input"),
    lookupButton: document.querySelector("#lead-lookup-button"),
    lookupResult: document.querySelector("#lead-lookup-result"),
    followUpCount: document.querySelector("#user-follow-up-count"),
    followUpList: document.querySelector("#user-follow-up-list"),
    pipelineCount: document.querySelector("#user-pipeline-count"),
    pipelineBoard: document.querySelector("#user-pipeline-board"),
    editorTitle: document.querySelector("#user-editor-title"),
    editorStage: document.querySelector("#user-editor-stage"),
    editorEmpty: document.querySelector("#user-editor-empty"),
    editorForm: document.querySelector("#user-lead-editor"),
    editorMessage: document.querySelector("#user-editor-message"),
    leadId: document.querySelector("#user-lead-id"),
    companyName: document.querySelector("#user-company-name"),
    contactName: document.querySelector("#user-contact-name"),
    sourceName: document.querySelector("#user-source-name"),
    leadValue: document.querySelector("#user-lead-value"),
    stageSelect: document.querySelector("#user-stage-select"),
    prioritySelect: document.querySelector("#user-priority-select"),
    probabilityInput: document.querySelector("#user-probability-input"),
    followUpInput: document.querySelector("#user-follow-up-input"),
    nextActionInput: document.querySelector("#user-next-action-input"),
    noteInput: document.querySelector("#user-note-input"),
    sourceSelect: document.querySelector("#lead-source-select"),
    createPrioritySelect: document.querySelector("#lead-priority-select"),
  };

  fillSelectOptions(refs.stageSelect, STAGE_OPTIONS);
  fillSelectOptions(refs.prioritySelect, PRIORITY_OPTIONS);
  fillSelectOptions(refs.sourceSelect, SOURCE_OPTIONS);
  fillSelectOptions(refs.createPrioritySelect, PRIORITY_OPTIONS);
  refs.createPrioritySelect.value = "Warm";

  const render = () => {
    const data = readStore();
    const activeUsers = data.users.filter((user) => user.status === "Active");
    const defaultUser = pickDefaultUser(activeUsers);

    if (!userState.currentUserId) {
      userState.currentUserId = getCurrentUserId() || defaultUser?.id || "";
    }

    if (!activeUsers.some((user) => user.id === userState.currentUserId)) {
      userState.currentUserId = defaultUser?.id || "";
    }

    fillUserOptions(refs.userSelector, activeUsers);
    refs.userSelector.value = userState.currentUserId;
    setCurrentUserId(userState.currentUserId);

    const myLeads = getSortedLeads(
      data.leads.filter((lead) => lead.ownerId === userState.currentUserId),
    );
    const wonCount = myLeads.filter((lead) => lead.stage === "Won").length;
    const dueLeads = myLeads.filter(isDueLead);
    const openValue = myLeads
      .filter((lead) => !CLOSED_STAGES.has(lead.stage))
      .reduce((sum, lead) => sum + lead.estimatedValue, 0);

    refs.myLeadCount.textContent = String(myLeads.length);
    refs.dueCount.textContent = String(dueLeads.length);
    refs.openValue.textContent = formatCurrency(openValue);
    refs.wonCount.textContent = String(wonCount);
    refs.pipelineCount.textContent = `${myLeads.length} leads`;
    refs.followUpCount.textContent = `${dueLeads.length} items`;

    refs.followUpList.innerHTML = dueLeads.length
      ? dueLeads
          .slice(0, 6)
          .map((lead) => {
            return `
              <article class="mini-item">
                <strong>${escapeHtml(lead.companyName)}</strong>
                <span>${escapeHtml(lead.id)} | ${escapeHtml(lead.stage)}</span>
                <p>${escapeHtml(lead.nextAction)}</p>
                <p>Follow-up: ${escapeHtml(formatDate(lead.followUpDate))}</p>
              </article>
            `;
          })
          .join("")
      : `<div class="mini-item"><strong>No urgent follow-ups</strong><p>Your due queue is clear for now.</p></div>`;

    if (!myLeads.some((lead) => lead.id === userState.selectedLeadId)) {
      userState.selectedLeadId = myLeads[0]?.id || null;
    }

    refs.pipelineBoard.innerHTML = STAGE_OPTIONS.map((stage) => {
      const stageLeads = myLeads.filter((lead) => lead.stage === stage);
      const stageValue = stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

      return `
        <section class="stage-column">
          <div class="stage-column__head">
            <div>
              <h3>${escapeHtml(stage)}</h3>
              <p>${escapeHtml(formatCurrency(stageValue))}</p>
            </div>
            <span class="subtle-chip">${escapeHtml(String(stageLeads.length))}</span>
          </div>
          <div class="stage-column__body">
            ${
              stageLeads.length
                ? stageLeads
                    .map((lead) => {
                      const selectedClass =
                        lead.id === userState.selectedLeadId ? "is-selected" : "";

                      return `
                        <button
                          class="lead-card ${selectedClass}"
                          type="button"
                          data-select-lead="${escapeHtml(lead.id)}"
                        >
                          <div class="lead-card__top">
                            <div>
                              <strong>${escapeHtml(lead.companyName)}</strong>
                              <small>${escapeHtml(lead.id)}</small>
                            </div>
                            ${badgeHtml(lead.priority, priorityClass(lead.priority))}
                          </div>
                          <p>${escapeHtml(lead.contactName)}</p>
                          <div class="lead-meta">
                            ${badgeHtml(lead.stage, stageClass(lead.stage))}
                            <span class="subtle-chip">${escapeHtml(formatCurrency(lead.estimatedValue))}</span>
                          </div>
                          <p>Next: ${escapeHtml(lead.nextAction)}</p>
                          <p>Follow-up: ${escapeHtml(formatDate(lead.followUpDate))}</p>
                        </button>
                      `;
                    })
                    .join("")
                : `<div class="mini-item"><strong>No leads</strong><p>No records in this stage.</p></div>`
            }
          </div>
        </section>
      `;
    }).join("");

    const selectedLead = myLeads.find((lead) => lead.id === userState.selectedLeadId);

    if (!selectedLead) {
      refs.editorEmpty.hidden = false;
      refs.editorForm.hidden = true;
      refs.editorTitle.textContent = "Choose a lead";
      refs.editorStage.textContent = "Waiting";
      refs.editorStage.className = "subtle-chip";
    } else {
      refs.editorEmpty.hidden = true;
      refs.editorForm.hidden = false;
      refs.editorTitle.textContent = selectedLead.companyName;
      refs.editorStage.textContent = selectedLead.stage;
      refs.editorStage.className = `badge ${stageClass(selectedLead.stage)}`;
      refs.leadId.value = selectedLead.id;
      refs.companyName.textContent = selectedLead.companyName;
      refs.contactName.textContent = selectedLead.contactName;
      refs.sourceName.textContent = selectedLead.source;
      refs.leadValue.textContent = formatCurrency(selectedLead.estimatedValue);
      refs.stageSelect.value = selectedLead.stage;
      refs.prioritySelect.value = selectedLead.priority;
      refs.probabilityInput.value = String(selectedLead.probability);
      refs.followUpInput.value = selectedLead.followUpDate || "";
      refs.nextActionInput.value = selectedLead.nextAction;
      refs.noteInput.value = selectedLead.lastNote;
    }

    refs.createMessage.textContent = userState.createMessage;
    refs.editorMessage.textContent = userState.editorMessage;
    renderSharedFooter();
  };

  refs.userSelector?.addEventListener("change", (event) => {
    userState.currentUserId = event.target.value;
    userState.selectedLeadId = null;
    userState.createMessage = "";
    userState.editorMessage = "";
    render();
  });

  refs.createForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(refs.createForm);
    const lead = createLead(
      {
        companyName: formData.get("companyName"),
        contactName: formData.get("contactName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        source: formData.get("source"),
        estimatedValue: formData.get("estimatedValue"),
        nextAction: formData.get("nextAction"),
        followUpDate: formData.get("followUpDate"),
        priority: formData.get("priority"),
        lastNote: formData.get("lastNote"),
      },
      userState.currentUserId,
    );

    if (lead) {
      userState.selectedLeadId = lead.id;
      userState.createMessage = `Lead ${lead.id} created for ${lead.companyName}.`;
      userState.editorMessage = "";
      refs.createForm.reset();
      refs.createPrioritySelect.value = "Warm";
      render();
    }
  });

  const showLeadLookup = () => {
    const lead = getLeadById(refs.lookupInput.value);

    if (!lead) {
      refs.lookupResult.className = "info-panel info-panel--empty";
      refs.lookupResult.innerHTML = "No lead found for that ID. Check the lead number and try again.";
      return;
    }

    refs.lookupResult.className = "info-panel";
    refs.lookupResult.innerHTML = leadLookupHtml(lead);
  };

  refs.lookupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showLeadLookup();
  });

  refs.lookupButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showLeadLookup();
  });

  refs.pipelineBoard?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-lead]");
    if (!button) {
      return;
    }

    userState.selectedLeadId = button.dataset.selectLead;
    userState.editorMessage = "";
    render();
  });

  refs.editorForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedLead = updateLead(refs.leadId.value, {
      stage: refs.stageSelect.value,
      priority: refs.prioritySelect.value,
      probability: refs.probabilityInput.value,
      nextAction: refs.nextActionInput.value,
      followUpDate: refs.followUpInput.value,
      lastNote: refs.noteInput.value,
    });

    if (updatedLead) {
      userState.selectedLeadId = updatedLead.id;
      userState.editorMessage = `Saved updates for ${updatedLead.id}.`;
      userState.createMessage = "";
      render();
    }
  });

  render();
  window.addEventListener("storage", render);
}

function filterAdminLeads(leads) {
  return leads.filter((lead) => {
    const stageMatch =
      adminState.stageFilter === "All" || lead.stage === adminState.stageFilter;
    const query = adminState.searchQuery.toLowerCase();
    const haystack = [
      lead.id,
      lead.companyName,
      lead.contactName,
      lead.ownerName,
      lead.email,
      lead.lastNote,
      lead.nextAction,
    ]
      .join(" ")
      .toLowerCase();

    return stageMatch && (!query || haystack.includes(query));
  });
}

function renderAdminPage() {
  const refs = {
    totalLeads: document.querySelector("#admin-total-leads"),
    hotLeads: document.querySelector("#admin-hot-leads"),
    wonValue: document.querySelector("#admin-won-value"),
    activeUsers: document.querySelector("#admin-active-users"),
    leadCount: document.querySelector("#admin-lead-count"),
    stageFilter: document.querySelector("#admin-stage-filter"),
    searchInput: document.querySelector("#admin-search-input"),
    leadList: document.querySelector("#admin-lead-list"),
    editorTitle: document.querySelector("#admin-editor-title"),
    editorStage: document.querySelector("#admin-editor-stage"),
    editorEmpty: document.querySelector("#admin-editor-empty"),
    editorForm: document.querySelector("#admin-lead-editor"),
    editorMessage: document.querySelector("#admin-editor-message"),
    leadId: document.querySelector("#admin-lead-id"),
    companyInput: document.querySelector("#admin-company-input"),
    contactInput: document.querySelector("#admin-contact-input"),
    emailInput: document.querySelector("#admin-email-input"),
    phoneInput: document.querySelector("#admin-phone-input"),
    sourceSelect: document.querySelector("#admin-source-select"),
    ownerSelect: document.querySelector("#admin-owner-select"),
    stageSelect: document.querySelector("#admin-stage-select"),
    prioritySelect: document.querySelector("#admin-priority-select"),
    valueInput: document.querySelector("#admin-value-input"),
    probabilityInput: document.querySelector("#admin-probability-input"),
    followUpInput: document.querySelector("#admin-follow-up-input"),
    nextActionInput: document.querySelector("#admin-next-action-input"),
    noteInput: document.querySelector("#admin-note-input"),
    userForm: document.querySelector("#admin-user-form"),
    userMessage: document.querySelector("#admin-user-message"),
    userTable: document.querySelector("#admin-user-table"),
    userCount: document.querySelector("#admin-user-count"),
    userRoleSelect: document.querySelector("#admin-user-role-select"),
    userStatusSelect: document.querySelector("#admin-user-status-select"),
  };

  fillSelectOptions(refs.stageFilter, STAGE_OPTIONS, true);
  fillSelectOptions(refs.sourceSelect, SOURCE_OPTIONS);
  fillSelectOptions(refs.stageSelect, STAGE_OPTIONS);
  fillSelectOptions(refs.prioritySelect, PRIORITY_OPTIONS);
  fillSelectOptions(refs.userRoleSelect, USER_ROLE_OPTIONS);
  fillSelectOptions(refs.userStatusSelect, USER_STATUS_OPTIONS);
  refs.stageFilter.value = adminState.stageFilter;

  const render = () => {
    const data = readStore();
    const leads = getSortedLeads(data.leads);
    const filteredLeads = filterAdminLeads(leads);
    const metrics = getMetrics(leads, data.users);
    const activeUsers = data.users.filter((user) => user.status === "Active");

    fillUserOptions(refs.ownerSelect, activeUsers);

    refs.totalLeads.textContent = String(metrics.totalLeads);
    refs.hotLeads.textContent = String(metrics.hotLeads);
    refs.wonValue.textContent = formatCurrency(metrics.wonValue);
    refs.activeUsers.textContent = String(metrics.activeUsers);
    refs.leadCount.textContent = `${filteredLeads.length} leads`;
    refs.userCount.textContent = `${data.users.length} users`;

    if (!filteredLeads.some((lead) => lead.id === adminState.selectedLeadId)) {
      adminState.selectedLeadId = filteredLeads[0]?.id || null;
    }

    refs.leadList.innerHTML = filteredLeads.length
      ? filteredLeads
          .map((lead) => {
            const selectedClass =
              lead.id === adminState.selectedLeadId ? "is-selected" : "";

            return `
              <button
                class="record-card ${selectedClass}"
                type="button"
                data-select-lead="${escapeHtml(lead.id)}"
              >
                <div class="record-card__top">
                  <div>
                    <strong>${escapeHtml(lead.companyName)}</strong>
                    <p>${escapeHtml(lead.id)} | ${escapeHtml(lead.contactName)}</p>
                  </div>
                  ${badgeHtml(lead.stage, stageClass(lead.stage))}
                </div>
                <div class="record-card__meta">
                  ${badgeHtml(lead.priority, priorityClass(lead.priority))}
                  <span class="subtle-chip">${escapeHtml(lead.ownerName)}</span>
                  <span class="subtle-chip">${escapeHtml(formatCurrency(lead.estimatedValue))}</span>
                </div>
                <p>${escapeHtml(lead.nextAction)}</p>
                <p>Updated ${escapeHtml(formatDateTime(lead.updatedAt))}</p>
              </button>
            `;
          })
          .join("")
      : `<div class="empty-state">No leads matched the selected filters.</div>`;

    const selectedLead = leads.find((lead) => lead.id === adminState.selectedLeadId);

    if (!selectedLead) {
      refs.editorEmpty.hidden = false;
      refs.editorForm.hidden = true;
      refs.editorTitle.textContent = "Choose a lead";
      refs.editorStage.textContent = "Waiting";
      refs.editorStage.className = "subtle-chip";
    } else {
      refs.editorEmpty.hidden = true;
      refs.editorForm.hidden = false;
      refs.editorTitle.textContent = selectedLead.companyName;
      refs.editorStage.textContent = selectedLead.stage;
      refs.editorStage.className = `badge ${stageClass(selectedLead.stage)}`;
      refs.leadId.value = selectedLead.id;
      refs.companyInput.value = selectedLead.companyName;
      refs.contactInput.value = selectedLead.contactName;
      refs.emailInput.value = selectedLead.email;
      refs.phoneInput.value = selectedLead.phone;
      refs.sourceSelect.value = selectedLead.source;
      refs.ownerSelect.value = selectedLead.ownerId;
      refs.stageSelect.value = selectedLead.stage;
      refs.prioritySelect.value = selectedLead.priority;
      refs.valueInput.value = String(selectedLead.estimatedValue);
      refs.probabilityInput.value = String(selectedLead.probability);
      refs.followUpInput.value = selectedLead.followUpDate || "";
      refs.nextActionInput.value = selectedLead.nextAction;
      refs.noteInput.value = selectedLead.lastNote;
    }

    refs.searchInput.value = adminState.searchQuery;
    refs.editorMessage.textContent = adminState.editorMessage;
    refs.userMessage.textContent = adminState.userMessage;

    refs.userTable.innerHTML = data.users.length
      ? data.users
          .map((user) => {
            return `
              <tr>
                <td>${escapeHtml(user.id)}</td>
                <td>${escapeHtml(user.fullName)}<br /><span class="eyebrow">${escapeHtml(user.email)}</span></td>
                <td>${escapeHtml(user.role)}</td>
                <td>${escapeHtml(user.department)}</td>
                <td>${badgeHtml(user.status, userStatusClass(user.status))}</td>
              </tr>
            `;
          })
          .join("")
      : renderEmptyRow(5, "No users available yet.");

    renderSharedFooter();
  };

  refs.stageFilter?.addEventListener("change", (event) => {
    adminState.stageFilter = event.target.value;
    render();
  });

  refs.searchInput?.addEventListener("input", (event) => {
    adminState.searchQuery = cleanText(event.target.value);
    render();
  });

  refs.leadList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-lead]");
    if (!button) {
      return;
    }

    adminState.selectedLeadId = button.dataset.selectLead;
    adminState.editorMessage = "";
    render();
  });

  refs.editorForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedLead = updateLead(refs.leadId.value, {
      companyName: refs.companyInput.value,
      contactName: refs.contactInput.value,
      email: refs.emailInput.value,
      phone: refs.phoneInput.value,
      source: refs.sourceSelect.value,
      ownerId: refs.ownerSelect.value,
      stage: refs.stageSelect.value,
      priority: refs.prioritySelect.value,
      estimatedValue: refs.valueInput.value,
      probability: refs.probabilityInput.value,
      followUpDate: refs.followUpInput.value,
      nextAction: refs.nextActionInput.value,
      lastNote: refs.noteInput.value,
    });

    if (updatedLead) {
      adminState.selectedLeadId = updatedLead.id;
      adminState.editorMessage = `Lead ${updatedLead.id} updated successfully.`;
      render();
    }
  });

  refs.userForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(refs.userForm);
    const user = createUser({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      role: formData.get("role"),
      department: formData.get("department"),
      status: formData.get("status"),
    });

    if (user) {
      adminState.userMessage = `User ${user.fullName} registered with ID ${user.id}.`;
      refs.userForm.reset();
      render();
    }
  });

  render();
  window.addEventListener("storage", render);
}

function initPage() {
  renderSharedFooter();

  if (document.body.dataset.page === "overview") {
    renderOverviewPage();
  }

  if (document.body.dataset.page === "user") {
    renderUserPage();
  }

  if (document.body.dataset.page === "admin") {
    renderAdminPage();
  }
}

document.addEventListener("DOMContentLoaded", initPage);

// src/services/budgetService.js

import { apiGet, apiPost, apiPut } from "./api";

/**
 * Get budget for a trip
 *
 * Backend:
 * GET /api/trips/:tripId/budget
 */
export async function getTripBudget(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  return apiGet(
    `/api/trips/${encodeURIComponent(tripId)}/budget`
  );
}

/**
 * Calculate trip budget locally.
 *
 * This does not require an API.
 *
 * Formula:
 *
 * Stay:
 *     days × stay per day
 *
 * Food:
 *     days × travellers × food per person per day
 *
 * Transport:
 *     days × travellers × transport per person per day
 *
 * Activities:
 *     days × travellers × activities per person per day
 */
export function calculateBudget({
  days = 1,
  travellers = 1,
  stay = 0,
  food = 0,
  transport = 0,
  activities = 0,
}) {
  const totalDays = Math.max(1, Number(days) || 1);
  const totalTravellers = Math.max(
    1,
    Number(travellers) || 1
  );

  const stayPerDay = Math.max(
    0,
    Number(stay) || 0
  );

  const foodPerPerson = Math.max(
    0,
    Number(food) || 0
  );

  const transportPerPerson = Math.max(
    0,
    Number(transport) || 0
  );

  const activitiesPerPerson = Math.max(
    0,
    Number(activities) || 0
  );

  const stayTotal =
    totalDays * stayPerDay;

  const foodTotal =
    totalDays *
    totalTravellers *
    foodPerPerson;

  const transportTotal =
    totalDays *
    totalTravellers *
    transportPerPerson;

  const activitiesTotal =
    totalDays *
    totalTravellers *
    activitiesPerPerson;

  const total =
    stayTotal +
    foodTotal +
    transportTotal +
    activitiesTotal;

  return {
    days: totalDays,
    travellers: totalTravellers,

    stay: stayPerDay,
    food: foodPerPerson,
    transport: transportPerPerson,
    activities: activitiesPerPerson,

    stayTotal,
    foodTotal,
    transportTotal,
    activitiesTotal,

    total,
  };
}

/**
 * Save budget for a trip.
 *
 * Backend:
 * PUT /api/trips/:tripId/budget
 */
export async function saveTripBudget(
  tripId,
  budget
) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  if (!budget || typeof budget !== "object") {
    throw new Error("Budget data is required.");
  }

  const calculatedBudget =
    calculateBudget(budget);

  return apiPut(
    `/api/trips/${encodeURIComponent(
      tripId
    )}/budget`,
    calculatedBudget
  );
}

/**
 * Create a budget without saving it.
 *
 * Useful for the Budget Planner before
 * the user creates a trip.
 */
export function createBudgetPlan(
  budgetData = {}
) {
  return calculateBudget(budgetData);
}

/**
 * Save a complete budget plan directly.
 *
 * Backend:
 * POST /api/budgets
 *
 * Keep this function ready for the
 * dedicated Budget API.
 */
export async function createBudget(
  budgetData
) {
  if (
    !budgetData ||
    typeof budgetData !== "object"
  ) {
    throw new Error(
      "Budget data is required."
    );
  }

  const calculatedBudget =
    calculateBudget(budgetData);

  return apiPost(
    "/api/budgets",
    calculatedBudget
  );
}

/**
 * Update an existing budget.
 *
 * Backend:
 * PUT /api/budgets/:budgetId
 */
export async function updateBudget(
  budgetId,
  budgetData
) {
  if (!budgetId) {
    throw new Error(
      "Budget ID is required."
    );
  }

  if (
    !budgetData ||
    typeof budgetData !== "object"
  ) {
    throw new Error(
      "Budget data is required."
    );
  }

  const calculatedBudget =
    calculateBudget(budgetData);

  return apiPut(
    `/api/budgets/${encodeURIComponent(
      budgetId
    )}`,
    calculatedBudget
  );
}

/**
 * Format amount into Indian Rupee format.
 *
 * Example:
 * 12500 -> ₹12,500
 */
export function formatBudgetAmount(
  amount
) {
  const value = Number(amount) || 0;

  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Get budget summary.
 */
export function getBudgetSummary(
  budgetData
) {
  const budget =
    calculateBudget(budgetData);

  return {
    stay: formatBudgetAmount(
      budget.stayTotal
    ),

    food: formatBudgetAmount(
      budget.foodTotal
    ),

    transport: formatBudgetAmount(
      budget.transportTotal
    ),

    activities: formatBudgetAmount(
      budget.activitiesTotal
    ),

    total: formatBudgetAmount(
      budget.total
    ),
  };
}
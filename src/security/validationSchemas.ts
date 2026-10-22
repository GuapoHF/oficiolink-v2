import { z } from 'zod';
import { sanitizeUserText } from './xssSanitizer';

/**
 * CONTROL #14: Validación estricta de todas las entradas con Zod (Cliente y Servidor)
 * CONTROL #8: Bloqueo de Mass Assignment mediante esquemas estrictos (.strict()) y DTOs
 */

const mexicanPhoneRegex = /^[0-9+\s()-]{8,20}$/;

export const ServiceRequestInputSchema = z
  .object({
    specialistId: z.string().min(3).max(80),
    clientName: z
      .string()
      .min(3, 'El nombre del cliente debe tener al menos 3 caracteres')
      .max(100, 'Nombre demasiado largo')
      .transform(sanitizeUserText),
    clientPhone: z
      .string()
      .regex(mexicanPhoneRegex, 'Formato de teléfono inválido (8 a 20 dígitos)'),
    clientZone: z
      .string()
      .min(4, 'Indica colonia y alcaldía/municipio')
      .max(140)
      .transform(sanitizeUserText),
    problemTitle: z
      .string()
      .min(5, 'El título del problema debe tener al menos 5 caracteres')
      .max(160)
      .transform(sanitizeUserText),
    problemDescription: z
      .string()
      .min(10, 'Describe el problema con al menos 10 caracteres')
      .max(1500)
      .transform(sanitizeUserText),
    urgency: z.enum(['emergencia_hoy', 'proximos_dias', 'programado']),
    suggestedDate: z.string().min(3).max(100).transform(sanitizeUserText),
    estimatedBudgetMXN: z
      .number()
      .min(100, 'El presupuesto mínimo es de $100 MXN')
      .max(2000000, 'Presupuesto excede el límite permitido'),
    issuePhotos: z.array(z.string().url()).min(1).max(5),
  })
  .strict();

export const OnboardingProfileInputSchema = z
  .object({
    fullName: z
      .string()
      .min(4, 'Ingresa tu nombre completo como aparece en tu INE')
      .max(120)
      .transform(sanitizeUserText),
    phone: z.string().regex(mexicanPhoneRegex, 'Teléfono inválido'),
    city: z.string().min(2).max(60).transform(sanitizeUserText),
    yearsExperience: z.number().int().min(1).max(60),
    primaryTrade: z.enum([
      'todos',
      'electricidad',
      'plomeria',
      'carpinteria',
      'herreria',
      'climatizacion',
      'pintura',
      'albanileria',
      'cerrajeria',
    ]),
    headline: z.string().min(10).max(220).transform(sanitizeUserText),
    bio: z.string().min(15).max(1200).transform(sanitizeUserText),
    diagnosticFee: z.number().min(150).max(10000),
    zonesInput: z.string().min(3).max(250).transform(sanitizeUserText),
    emergency247: z.boolean(),
    projectTitle: z.string().min(5).max(160).transform(sanitizeUserText),
    projectCost: z.number().min(100).max(1500000),
    projectDuration: z.string().min(2).max(60).transform(sanitizeUserText),
    projectDesc: z.string().min(10).max(1000).transform(sanitizeUserText),
  })
  .strict();

export const VerifiedReviewInputSchema = z
  .object({
    serviceRequestId: z.string().min(3).max(80),
    specialistId: z.string().min(3).max(80),
    punctuality: z.number().min(1).max(5),
    quality: z.number().min(1).max(5),
    cleanliness: z.number().min(1).max(5),
    fairPrice: z.number().min(1).max(5),
    comment: z
      .string()
      .min(10, 'La reseña debe contener al menos 10 caracteres')
      .max(1200, 'La reseña no puede exceder 1200 caracteres')
      .transform(sanitizeUserText),
  })
  .strict();

export const LoginCredentialsSchema = z
  .object({
    email: z.string().email('Correo electrónico inválido').max(150),
    password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres').max(128),
  })
  .strict();

/**
 * CONTROL #8 (Anti-Mass Assignment):
 * Elimina explícitamente campos privilegiados de cualquier payload entrante del cliente.
 */
const PROTECTED_PRIVILEGE_FIELDS = new Set([
  'role',
  'is_identity_verified',
  'verified',
  'rating_avg',
  'rating',
  'total_reviews',
  'reviewsCount',
  'completed_jobs',
  'completedJobs',
  'badge_code',
  'failed_login_attempts',
  'locked_until',
]);

export function sanitizeMassAssignmentDTO<T extends Record<string, unknown>>(
  payload: T
): { cleanPayload: Partial<T>; blockedFields: string[] } {
  const cleanPayload: Partial<T> = {};
  const blockedFields: string[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (PROTECTED_PRIVILEGE_FIELDS.has(key)) {
      blockedFields.push(key);
    } else {
      (cleanPayload as Record<string, unknown>)[key] = value;
    }
  }

  return { cleanPayload, blockedFields };
}

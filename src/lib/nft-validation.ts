import { CreateCollectionForm, CreateNFTForm, NFTAttribute, ValidationError } from '../types'

// Collection validation rules
export const COLLECTION_VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
  },
  symbol: {
    minLength: 2,
    maxLength: 10,
    pattern: /^[A-Z0-9]+$/,
  },
  description: {
    maxLength: 500,
  },
  maxSupply: {
    min: 1,
    max: 1000000,
  },
  royaltyPercentage: {
    min: 0,
    max: 25,
  },
}

// NFT validation rules
export const NFT_VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
  },
  description: {
    maxLength: 500,
  },
  price: {
    min: 0,
    pattern: /^\d+(\.\d{1,18})?$/,
  },
}

// URL validation patterns
export const URL_PATTERNS = {
  website: /^https?:\/\/.+/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
  discord: /^https?:\/\/(www\.)?discord\.gg\/.+/,
  telegram: /^https?:\/\/(www\.)?t\.me\/.+/,
  github: /^https?:\/\/(www\.)?github\.com\/.+/,
}

// Validate collection form
export function validateCollectionForm(data: CreateCollectionForm): ValidationError[] {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name) {
    errors.push({ field: 'name', message: 'Collection name is required' })
  } else if (data.name.length < COLLECTION_VALIDATION_RULES.name.minLength) {
    errors.push({
      field: 'name',
      message: `Collection name must be at least ${COLLECTION_VALIDATION_RULES.name.minLength} characters`,
    })
  } else if (data.name.length > COLLECTION_VALIDATION_RULES.name.maxLength) {
    errors.push({
      field: 'name',
      message: `Collection name must be less than ${COLLECTION_VALIDATION_RULES.name.maxLength} characters`,
    })
  } else if (!COLLECTION_VALIDATION_RULES.name.pattern.test(data.name)) {
    errors.push({
      field: 'name',
      message: 'Collection name can only contain letters, numbers, and spaces',
    })
  }

  // Symbol validation
  if (!data.symbol) {
    errors.push({ field: 'symbol', message: 'Collection symbol is required' })
  } else if (data.symbol.length < COLLECTION_VALIDATION_RULES.symbol.minLength) {
    errors.push({
      field: 'symbol',
      message: `Collection symbol must be at least ${COLLECTION_VALIDATION_RULES.symbol.minLength} characters`,
    })
  } else if (data.symbol.length > COLLECTION_VALIDATION_RULES.symbol.maxLength) {
    errors.push({
      field: 'symbol',
      message: `Collection symbol must be less than ${COLLECTION_VALIDATION_RULES.symbol.maxLength} characters`,
    })
  } else if (!COLLECTION_VALIDATION_RULES.symbol.pattern.test(data.symbol)) {
    errors.push({
      field: 'symbol',
      message: 'Collection symbol can only contain uppercase letters and numbers',
    })
  }

  // Description validation
  if (data.description && data.description.length > COLLECTION_VALIDATION_RULES.description.maxLength) {
    errors.push({
      field: 'description',
      message: `Description must be less than ${COLLECTION_VALIDATION_RULES.description.maxLength} characters`,
    })
  }

  // Cover image validation
  if (!data.coverImage) {
    errors.push({ field: 'coverImage', message: 'Cover image is required' })
  }

  // Max supply validation
  if (data.maxSupply !== undefined) {
    if (data.maxSupply < COLLECTION_VALIDATION_RULES.maxSupply.min) {
      errors.push({
        field: 'maxSupply',
        message: `Max supply must be at least ${COLLECTION_VALIDATION_RULES.maxSupply.min}`,
      })
    } else if (data.maxSupply > COLLECTION_VALIDATION_RULES.maxSupply.max) {
      errors.push({
        field: 'maxSupply',
        message: `Max supply must be less than ${COLLECTION_VALIDATION_RULES.maxSupply.max}`,
      })
    }
  }

  // Royalty percentage validation
  if (data.royaltyPercentage < COLLECTION_VALIDATION_RULES.royaltyPercentage.min) {
    errors.push({
      field: 'royaltyPercentage',
      message: `Royalty percentage must be at least ${COLLECTION_VALIDATION_RULES.royaltyPercentage.min}%`,
    })
  } else if (data.royaltyPercentage > COLLECTION_VALIDATION_RULES.royaltyPercentage.max) {
    errors.push({
      field: 'royaltyPercentage',
      message: `Royalty percentage must be less than ${COLLECTION_VALIDATION_RULES.royaltyPercentage.max}%`,
    })
  }

  // Social links validation
  if (data.website && !URL_PATTERNS.website.test(data.website)) {
    errors.push({ field: 'website', message: 'Please enter a valid website URL' })
  }
  if (data.twitter && !URL_PATTERNS.twitter.test(data.twitter)) {
    errors.push({ field: 'twitter', message: 'Please enter a valid Twitter URL' })
  }
  if (data.discord && !URL_PATTERNS.discord.test(data.discord)) {
    errors.push({ field: 'discord', message: 'Please enter a valid Discord invite URL' })
  }
  if (data.telegram && !URL_PATTERNS.telegram.test(data.telegram)) {
    errors.push({ field: 'telegram', message: 'Please enter a valid Telegram URL' })
  }
  if (data.github && !URL_PATTERNS.github.test(data.github)) {
    errors.push({ field: 'github', message: 'Please enter a valid GitHub URL' })
  }

  return errors
}

// Validate NFT form
export function validateNFTForm(data: CreateNFTForm): ValidationError[] {
  const errors: ValidationError[] = []

  // Name validation
  if (!data.name) {
    errors.push({ field: 'name', message: 'NFT name is required' })
  } else if (data.name.length < NFT_VALIDATION_RULES.name.minLength) {
    errors.push({
      field: 'name',
      message: `NFT name must be at least ${NFT_VALIDATION_RULES.name.minLength} characters`,
    })
  } else if (data.name.length > NFT_VALIDATION_RULES.name.maxLength) {
    errors.push({
      field: 'name',
      message: `NFT name must be less than ${NFT_VALIDATION_RULES.name.maxLength} characters`,
    })
  } else if (!NFT_VALIDATION_RULES.name.pattern.test(data.name)) {
    errors.push({
      field: 'name',
      message: 'NFT name can only contain letters, numbers, and spaces',
    })
  }

  // Description validation
  if (data.description && data.description.length > NFT_VALIDATION_RULES.description.maxLength) {
    errors.push({
      field: 'description',
      message: `Description must be less than ${NFT_VALIDATION_RULES.description.maxLength} characters`,
    })
  }

  // Image validation
  if (!data.image) {
    errors.push({ field: 'image', message: 'NFT image is required' })
  }

  // Collection validation
  if (!data.collectionId) {
    errors.push({ field: 'collectionId', message: 'Collection is required' })
  }

  // Price validation
  if (data.price !== undefined && data.price !== '') {
    if (parseFloat(data.price) < NFT_VALIDATION_RULES.price.min) {
      errors.push({
        field: 'price',
        message: `Price must be at least ${NFT_VALIDATION_RULES.price.min}`,
      })
    } else if (!NFT_VALIDATION_RULES.price.pattern.test(data.price)) {
      errors.push({
        field: 'price',
        message: 'Please enter a valid price',
      })
    }
  }

  // Attributes validation
  if (data.attributes) {
    data.attributes.forEach((attr, index) => {
      if (!attr.trait_type || attr.trait_type.trim() === '') {
        errors.push({
          field: `attributes.${index}.trait_type`,
          message: 'Trait type is required',
        })
      }
      if (attr.value === undefined || attr.value === null || attr.value === '') {
        errors.push({
          field: `attributes.${index}.value`,
          message: 'Trait value is required',
        })
      }
    })
  }

  return errors
}

// Validate NFT attributes
export function validateNFTAttributes(attributes: NFTAttribute[]): ValidationError[] {
  const errors: ValidationError[] = []

  if (!Array.isArray(attributes)) {
    errors.push({ field: 'attributes', message: 'Attributes must be an array' })
    return errors
  }

  attributes.forEach((attr, index) => {
    if (!attr.trait_type || attr.trait_type.trim() === '') {
      errors.push({
        field: `attributes.${index}.trait_type`,
        message: 'Trait type is required',
      })
    }

    if (attr.value === undefined || attr.value === null || attr.value === '') {
      errors.push({
        field: `attributes.${index}.value`,
        message: 'Trait value is required',
      })
    }

    if (attr.trait_type && attr.trait_type.length > 50) {
      errors.push({
        field: `attributes.${index}.trait_type`,
        message: 'Trait type must be less than 50 characters',
      })
    }

    if (attr.value && String(attr.value).length > 100) {
      errors.push({
        field: `attributes.${index}.value`,
        message: 'Trait value must be less than 100 characters',
      })
    }
  })

  return errors
}

// Sanitize collection form data
export function sanitizeCollectionForm(data: CreateCollectionForm): CreateCollectionForm {
  return {
    ...data,
    name: data.name.trim(),
    symbol: data.symbol.trim().toUpperCase(),
    description: data.description?.trim() || '',
    website: data.website?.trim() || '',
    twitter: data.twitter?.trim() || '',
    discord: data.discord?.trim() || '',
    telegram: data.telegram?.trim() || '',
    github: data.github?.trim() || '',
  }
}

// Sanitize NFT form data
export function sanitizeNFTForm(data: CreateNFTForm): CreateNFTForm {
  return {
    ...data,
    name: data.name.trim(),
    description: data.description?.trim() || '',
    price: data.price?.trim() || '',
  }
}

// Check if form has errors
export function hasFormErrors(errors: ValidationError[]): boolean {
  return errors.length > 0
}

// Get error message for specific field
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(error => error.field === field)?.message
}

// Format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.map(error => `${error.field}: ${error.message}`)
}

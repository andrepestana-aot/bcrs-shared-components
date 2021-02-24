import {
  BusinessIF, NameRequestIF, NameTranslationIF, ShareStructureIF, ContactPointIF
} from '@/interfaces'

/**
 * A filing's alteration object from the API. See:
 * https://github.com/bcgov/business-schemas/blob/master/src/registry_schemas/schemas/alteration.json
 */
export interface AlterationIF {
  provisionsRemoved: boolean
  business: BusinessIF
  nameRequest?: NameRequestIF
  nameTranslations: NameTranslationIF[]
  shareStructure: ShareStructureIF
  contactPoint: ContactPointIF
  [propName: string]: any // excess properties
}

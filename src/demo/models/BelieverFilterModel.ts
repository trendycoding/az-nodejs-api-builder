/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Filter data to be used to find a believer
 */
export interface HttpsBelieverEvangelizerSite {
  /**
   * Partial first name
   */
  firstName?: string;
  /**
   * Partial last name
   */
  lastName?: string;
  /**
   * Partial phone number used to search for a believer
   */
  phone?: string;
  /**
   * Comments about the believer including needs
   */
  comments?: string;
  /**
   * Text contained in a prayer request comment
   */
  prayerRequests?: string;
  [k: string]: unknown;
}

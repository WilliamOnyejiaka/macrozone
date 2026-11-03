export * from "./constants";

export interface FileObject {
    mimetype: string;
    filename: string;
    path: string;
    size: number;
    originalname: string;
}

export interface UploadedImageData {
    mimeType: string;
    imageUrl: string;
    publicId: string;
    size: number;
}

export interface UploadResult {
    success: boolean;
    data?: Record<string, UploadedImageData>;
    error?: { fieldName: string; message: string }[];
    publicIds?: string[]
}

export interface UploadArrResult {
    success: boolean;
    data?: UploadedImageData[];
    error?: { fieldName: string; message: string }[];
    publicIds?: string[]
}

export type UploadedFiles = {
    publicId: string,
    size: string,
    url: string,
    mimeType: string,
    thumbnail: string | null,
    duration: string | null
};

export type FailedFiles = {
    filename: string,
    error: string
};

export interface FileObject {
    mimetype: string;
    filename: string;
    path: string;
    size: number;
    originalname: string;
}

export const CacheKeys = {
    user: 'user',
    partner: 'partner',
    client: 'client',
    socialAccount: (id: string) =>
        `${id}:socialAccount`,
    socialAccounts: (id: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `${id}:socialAccounts:page:${page}:limit:${limit}`
            : `${id}:socialAccounts:*`,
    socialAccountsPattern: (id: string) =>
        `${id}:socialAccounts:*`,

    performanceMetric: (id: string) =>
        `${id}:performanceMetric`,
    performanceMetrics: (id: string, page: number, limit: number) =>
        `${id}:performanceMetrics:page:${page}:limit:${limit}`,
    evidenceDocument: (id: string) =>
        `${id}:evidenceDocument`,
    evidenceDocuments: (id: string) =>
        `${id}:evidenceDocuments`,
    partnerPreference: (id: string) =>
        `${id}:partnerPreference`,
    partnerPreferences: (id: string) =>
        `${id}:partnerPreferences`,
    partnerPartnershipHistory: (id: string) =>
        `${id}:partnerPartnershipHistory`,
    partnerPartnershipHistories: (id: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `${id}:partnerPartnershipHistories:page:${page}:limit:${limit}`
            : `${id}:partnerPartnershipHistories:*`,
    partnerPartnershipHistoriesPattern: (id: string) =>
        `${id}:partnerPartnershipHistories:*`,

    userProfile: (id: string) =>
        `${id}:profile`,

    organization: 'organization',
    organizationDetails: (orgId: string) =>
        `${orgId}:details`,
    userOrganizations: (userId: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `user:${userId}:orgs:page:${page}:limit:${limit}`
            : `user:${userId}:orgs:*`,
    userOrganizationsPattern: (userId: string) =>
        `user:${userId}:orgs:*`,
    organizationMembers: (orgId: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `${orgId}:members:page:${page}:limit:${limit}`
            : `${orgId}:members:*`,
    organizationMembersPattern: (orgId: string) =>
        `${orgId}:members:*`,
    orgPartnershipRequirements: (orgId: string) =>
        `${orgId}:partnershipRequirements`,
    userInvitations: (userId: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `user:${userId}:invitations:page:${page}:limit:${limit}`
            : `user:${userId}:invitations:*`,
    userInvitationsPattern: (userId: string) =>
        `user:${userId}:invitations:*`,
    orgMemberInvitations: (orgId: string, page?: number, limit?: number) =>
        page !== undefined && limit !== undefined
            ? `${orgId}:invitations:page:${page}:limit:${limit}`
            : `${orgId}:invitations:*`,
    orgMemberInvitationsPattern: (orgId: string) =>
        `${orgId}:invitations:*`,

    directoryContact: 'directory-contact'
};
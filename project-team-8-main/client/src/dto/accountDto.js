export function authDto(raw) {
  if (!raw?.isAuthenticated || !raw.token)
    throw new Error('Sign in failed. Check your credentials.')
  return { token: raw.token, role: raw.role, name: raw.userName, id: raw.userID }
}

export function profileDto(raw = {}) {
  return {
    semester: raw.semester || '',
    interest: raw.interest || '',
    languages: raw.mainCoding_Language || '',
    contact: raw.contact_Detail || '',
  }
}

export function profileInput(form) {
  return {
    semester: form.semester.trim(),
    interest: form.interest.trim(),
    mainCoding_Language: form.languages.trim(),
    contact_Detail: form.contact.trim(),
  }
}

export function commentDto(raw) {
  return {
    id: raw.commentID,
    name: raw.userName || 'Community member',
    text: raw.commentText || '',
    createdAt: raw.originalTimestamp || raw.dateTimes,
  }
}

export function projectDto(raw) {
  return {
    id: raw.projectID,
    name: raw.projectName || 'Untitled project',
    overview: raw.projectOverView || '',
    teamName: raw.teamName || '',
    teamNumber: raw.teamNumber,
    members: raw.teamMember || '',
    semester: raw.semester || '',
    languages: raw.languageUsed || '',
    githubUrl: safeUrl(raw.linktoGit),
    videoUrl: safeUrl(raw.linktoYoutube),
    createdAt: raw.dateCreated,
    ownerId: raw.ownerID,
    approved: raw.isApproved === true,
    winner: raw.isWinner === true,
    likes: raw.likeCount || 0,
  }
}

export function safeUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export function projectInput(form) {
  return {
    teamName: form.teamName.trim(),
    teamNumber: Number(form.teamNumber),
    teamMember: form.members.trim(),
    projectName: form.name.trim(),
    projectOverView: form.overview.trim(),
    semester: form.semester.trim(),
    languageUsed: form.languages.trim(),
    linktoGit: form.githubUrl.trim(),
    linktoYoutube: form.videoUrl.trim(),
  }
}

export function projectFormData(form) {
  const data = new FormData()
  Object.entries(projectInput(form)).forEach(([key, value]) => data.append(key, value))
  if (form.image) data.append('img', form.image)
  return data
}

export function emptyProject() {
  return {
    name: '',
    overview: '',
    teamName: '',
    teamNumber: '',
    members: '',
    semester: '',
    languages: '',
    githubUrl: '',
    videoUrl: '',
    image: null,
  }
}

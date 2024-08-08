export const getChesscomArchives = async (username: string): Promise<string[]> => {
  console.log('Fetching archives for', username)
  const response = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`
  )
  const responseJson = await response.json()  
  return responseJson.archives
}

export const getLastArchiveToFetch = async (archives: string[], lastFetch: Date | null): Promise<string> => {
  if (lastFetch === null) {
    return archives[0]
  }

  const lastFetchYear = lastFetch.getFullYear()
  const lastFetchMonth = lastFetch.getMonth() + 1
    
  const lastArchive = archives.find((archive) => {

    const regex = /\/(\d{4})\/(\d{2})$/;
    const match = archive.match(regex);

    if (match === null) {
        throw new Error(`Invalid archive format: ${archive}`)
    }

    const archiveYear = Number(match[1])
    const archiveMonth = Number(match[2])

    return archiveYear >= lastFetchYear && archiveMonth >= lastFetchMonth
  })

  return lastArchive ?? archives[0]
}

export const getGamesFromArchive = async (archive: string): Promise<any> => {
  const response = await fetch(archive)
  const responseJson = await response.json()
  return responseJson.games
}
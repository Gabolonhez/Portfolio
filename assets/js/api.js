
async function fetchProfileData() {
    const url = './assets/data/profilePT.json';
    const response = await fetch(url)
    const profileData = await response.json()
    return profileData
}

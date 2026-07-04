document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');
    const topSearch = document.getElementById('search-bar-header');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all navs
            navItems.forEach(n => n.classList.remove('active'));
            // Add active to clicked nav
            item.classList.add('active');

            // Hide all views
            views.forEach(v => {
                v.style.display = 'none';
                v.classList.remove('active');
            });

            // Show targeted view
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                const targetView = document.getElementById(targetId);
                targetView.style.display = 'block';
                // trigger reflow
                void targetView.offsetWidth;
                targetView.classList.add('active');
            }

            // Show/Hide Top Search Bar based on view
            if (targetId === 'search-view') {
                topSearch.style.display = 'flex';
            } else {
                topSearch.style.display = 'none';
            }
        });
    });

    // Player Logic
    const audio = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    
    const playerCover = document.querySelector('.player-cover');
    const songNameEl = document.querySelector('.song-name');
    const artistNameEl = document.querySelector('.artist-name');

    // Play buttons in main content
    const playCards = document.querySelectorAll('.play-card-btn, .play-recent-btn');
    
    // Progress Bar
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');

    // Volume
    const volumeContainer = document.getElementById('volume-container');
    const volumeLevel = document.getElementById('volume-level');
    const volumeIcon = document.getElementById('volume-icon');

    let isPlaying = false;

    // Toggle Play/Pause function
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        } else {
            audio.play();
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    }

    playPauseBtn.addEventListener('click', togglePlay);

    // Make all play buttons in content trigger the audio
    playCards.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Get the parent card to fetch data attributes
            const card = btn.closest('.card') || btn.closest('.recent-item');
            if (card) {
                const src = card.getAttribute('data-src');
                const title = card.getAttribute('data-title');
                const artist = card.getAttribute('data-artist');
                const cover = card.getAttribute('data-cover');
                
                if (src && audio.getAttribute('src') !== src) {
                    audio.src = src;
                    songNameEl.innerText = title || "Unknown Title";
                    artistNameEl.innerText = artist || "Unknown Artist";
                    playerCover.src = cover || "assets/laroi_cover.png";
                    isPlaying = false; // Reset to trigger play below

                    // Update currentSongIndex if playlist is initialized
                    if (typeof playlist !== 'undefined') {
                        const index = playlist.findIndex(s => s.src === src);
                        if (index !== -1) {
                            currentSongIndex = index;
                        }
                    }
                }
            }

            if (!isPlaying) {
                audio.play();
                playPauseIcon.classList.remove('fa-play');
                playPauseIcon.classList.add('fa-pause');
                isPlaying = true;
            } else {
                // If already playing the same song, restart
                audio.currentTime = 0;
                audio.play();
            }
        });
    });

    // Playlist logic for Next/Previous
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentSongIndex = 0;
    let playlist = [];

    // Initialize playlist from recent items (which contains unique songs we have)
    const playlistElements = document.querySelectorAll('.recent-item[data-src]');
    playlistElements.forEach(el => {
        playlist.push({
            src: el.getAttribute('data-src'),
            title: el.getAttribute('data-title'),
            artist: el.getAttribute('data-artist'),
            cover: el.getAttribute('data-cover')
        });
    });

    const favSongs = new Set();
    const favSongsList = document.getElementById('fav-songs-list');
    const heartIcon = document.querySelector('.heart-icon');

    function loadSong(index) {
        if (playlist.length === 0) return;
        const song = playlist[index];
        audio.src = song.src;
        songNameEl.innerText = song.title || "Unknown Title";
        artistNameEl.innerText = song.artist || "Unknown Artist";
        playerCover.src = song.cover || "assets/laroi_cover.png";
        
        audio.currentTime = 0;
        
        // Update heart icon state based on whether song is in favorites
        const songId = songNameEl.innerText + '-' + artistNameEl.innerText;
        if (favSongs.has(songId)) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
            heartIcon.style.color = 'var(--accent)';
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
            heartIcon.style.color = 'var(--text-secondary)';
        }
        
        // Automatically play when switching songs
        audio.play();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
        isPlaying = true;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (playlist.length === 0) return;
            currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
            loadSong(currentSongIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (playlist.length === 0) return;
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);
        });
    }

    // Auto-play next song when current song ends
    audio.addEventListener('ended', () => {
        if (playlist.length > 0) {
            currentSongIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(currentSongIndex);
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
            isPlaying = false;
        }
    });

    // Format time (seconds to M:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update Progress Bar
    audio.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.innerText = formatTime(currentTime);
        if (duration) {
            totalTimeEl.innerText = formatTime(duration);
        }
    });

    // Set Progress Bar on click
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // Set Audio Volume
    volumeContainer.addEventListener('click', (e) => {
        const width = volumeContainer.clientWidth;
        const clickX = e.offsetX;
        const vol = clickX / width;
        audio.volume = vol;
        volumeLevel.style.width = `${vol * 100}%`;
        updateVolumeIcon(vol);
    });

    function updateVolumeIcon(vol) {
        volumeIcon.className = 'fas control-icon';
        if (vol === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (vol < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    // Initial load volume
    audio.volume = 0.5;
    volumeLevel.style.width = '50%';

    // Favorite/Heart functionality
    if (heartIcon) {
        heartIcon.addEventListener('click', () => {
            const songName = songNameEl.innerText;
            const artistName = artistNameEl.innerText;
            const coverSrc = playerCover.src;
            const songId = songName + '-' + artistName;

            if (heartIcon.classList.contains('far')) {
                // Not favorited yet -> Favorite it
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                heartIcon.style.color = 'var(--accent)';
                
                if (!favSongs.has(songId)) {
                    favSongs.add(songId);
                    
                    const li = document.createElement('li');
                    li.setAttribute('data-id', songId);
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.gap = '12px';
                    li.style.padding = '10px';
                    li.style.cursor = 'pointer';
                    li.style.borderRadius = '4px';
                    
                    li.innerHTML = `
                        <img src="${coverSrc}" alt="Cover" class="playlist-icon" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                        <div class="playlist-info">
                            <h4 style="font-size: 14px; margin-bottom: 2px;">${songName}</h4>
                            <p style="font-size: 12px; color: var(--text-secondary);">${artistName}</p>
                        </div>
                    `;
                    
                    // Add hover effect
                    li.addEventListener('mouseenter', () => li.style.backgroundColor = 'var(--card-hover)');
                    li.addEventListener('mouseleave', () => li.style.backgroundColor = 'transparent');
                    
                    if (favSongsList) {
                        favSongsList.appendChild(li);
                    }
                }
            } else {
                // Favorited -> Unfavorite it
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                heartIcon.style.color = 'var(--text-secondary)';
                
                if (favSongs.has(songId)) {
                    favSongs.delete(songId);
                    if (favSongsList) {
                        const li = favSongsList.querySelector(`li[data-id="${songId}"]`);
                        if (li) {
                            li.remove();
                        }
                    }
                }
            }
        });
    }
});

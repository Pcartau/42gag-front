import React from "react";
import { getHomePageImages, postImage, likeImage } from '../utils/api';
import { useHistory } from "react-router-dom";
import { ReactComponent as Heart } from '../heart.svg';
import { ReactComponent as Add } from '../add.svg';
import { ReactComponent as Flame } from '../flame.svg';
import '../Home.css'

export default function Home() {
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [mode, setMode] = React.useState('latest');
  const [images, setImages] = React.useState([]);
  const [addPopup, setPopup] = React.useState(false);
  const [likeTimer, setLikeTimer] = React.useState(-1);
  const [title, setTitle] = React.useState('');
  const [preview, setPreview] = React.useState('#');
  const [sending, setSend] = React.useState(false);

  React.useEffect(() => {
    getHomePageImages(0, mode).then((images) => {
      if (!images) {
        history.push("/login");
      } else {
        setImages(images);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      requestNewImages();
    }
  };

  function requestNewImages() {
    if (page === -1) return;
    getHomePageImages(page + 1, mode).then((newImages) => {
      if (newImages.length === 0) {
        setPage(-1);
      } else {
        setImages([...images, ...newImages]);
        setPage(page + 1);
      }
    });
  }

  function changeMode(newMode) {
    setPage(-1);
    setMode(newMode);
    setImages([]);
    getHomePageImages(0, newMode).then((newImages) => {
      if (newImages.length === 0) {
        setPage(-1);
      } else {
        setImages(newImages);
        setPage(0);
      }
    })
  }

  function resetPopup() {
    setPopup(!addPopup);
    setSend(false);
    setTitle('');
    setPreview('#');
  }

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function handlePost() {
    const photo = document.getElementById("image-file").files[0];
    const anonym = document.getElementById("anonym-input").checked;

    if (!photo || title === '') {
      return alert('Missing data !');
    }
    setSend(true);
    const base64 = await toBase64(photo);
    postImage(title, anonym, base64).then((res) => {
      alert(res ? 'Image postée !' : 'Image non postée.\nMax size: 1mb')
      resetPopup();
    });
  }

  async function handleLike(image_id, index) {
    const elem = document.getElementById(index);
    
    if (likeTimer !== -1) {
      elem.style.opacity = 1;
      setTimeout(() => elem.style.opacity = 0, 500);
      likeImage(image_id);
      setLikeTimer(-1);
    } else {
      setLikeTimer(1);
      setTimeout(() => setLikeTimer(-1), 2000);
    }
  }

  function Footer() {
    return (
      <div className="footer">
        <Flame width={30} height={30} onClick={() => changeMode('latest')} />
        <Add fill={'#ffffff'} width={30} height={30} onClick={() => setPopup(!addPopup)} />
        <Heart fill={'#ffffff'} width={30} height={30} onClick={() => changeMode('hotest')} />
      </div>
    )
  }

  return (
    <div className="main">
      <div className="main-container">
        {images.map((image, index) =>
          <div className="image-container" key={index}>
            <div className="header-title">
              <p className="title">{image.title}</p>
            </div>
            <div style={{position: 'relative'}} onClick={() => handleLike(image._id, index)}>
              <div id={index} className="liked-image">
                <Heart width="100px" height="100px" fill="#ff5023" />
              </div>
              <div className="linear-gradient" />
              <div className="revert-linear-gradient" />
              <div className="header-user">
                <img alt="user-img" src={image.userImg} className="user-image" />
                <a className="user-link" href={image.userUrl}>{image.username}</a>
              </div>
              <img alt="main-img" className="image" src={image.base64} />
              <div className="likes-container">
                <Heart width="20px" height="20px" fill="#ff5023" />
                <p className="heart-desc">{image.likesNumber}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {addPopup ? 
        <div className="add-popup">
          <input className="title-input" id="title-input" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />

          {preview === '#' ?
            <label id="label" for="image-file" className="custom-file-upload">Choose picture to upload</label>
            :
            <img alt="preview" src={preview} className="preview-image" />
          }
          <input id="image-file" type="file" accept="image/*" style={{display: 'none'}} onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))} />

          <div className="anonym-container">
            <label for="anonym-input" className="">Send as anonym</label>
            <input id="anonym-input" type="checkbox" />
          </div>

          {sending ?
            <p className="confirm-button">Envoi en cours...</p>
            :
            <div className="buttons-container">
              <p className="confirm-button" onClick={() => handlePost()}>Send Image</p>
              <p className="cancel-button" onClick={() => resetPopup()}>Cancel</p>
            </div>
          }
        </div>
        :
        null
      }
      <Footer />
    </div>
  )
}
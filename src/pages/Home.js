import React from "react";
import { getHomePageImages, postImage, likeImage } from '../utils/api';
import { useHistory } from "react-router-dom";
import { ReactComponent as Heart } from '../heart.svg';
import { ReactComponent as Add } from '../add.svg';
import '../Home.css'

export default function Home() {
  const history = useHistory();
  const [images, setImages] = React.useState([]);
  const [addPopup, setPopup] = React.useState(false);
  const [likeTimer, setLikeTimer] = React.useState(-1);
  const [labelText, changeLabel] = React.useState('Choose picture to upload');

  React.useEffect(() => {
    getHomePageImages().then((images) => {
      if (!images) {
        history.push("/login");
      } else {
        setImages(images);
      }
    });
  }, []);

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  async function handlePost() {
    const photo = document.getElementById("image-file").files[0];
    const title = document.getElementById("title-input").value;
    const anonym = document.getElementById("anonym-input").checked;

    if (!photo || !title) {
      return alert('Missing data !');
    }
    const base64 = await toBase64(photo);
    postImage(title, anonym, base64).then((res) => {
      changeLabel('Choose picure to upload');
      alert(res ? 'Image postée !' : 'Image non postée.\nMax size: 1mb')
    });
  }

  async function handleLike(image_id, index) {
    const elem = document.getElementById(index);
    
    if (likeTimer !== -1) {
      elem.style.opacity = 1;
      setTimeout(() => elem.style.opacity = 0, 500);
      likeImage(image_id).then(() => setImages(images));
      setLikeTimer(-1);
    } else {
      setLikeTimer(1);
      setTimeout(() => setLikeTimer(-1), 2000);
    }
  }

  function Footer() {
    return (
      <div className="footer">
        <Add width={30} height={30} onClick={() => setPopup(!addPopup)} />
      </div>
    )
  }
  
  function AddImage() {
    return (
      <div className="add-popup">
        <input className="title-input" id="title-input" placeholder="Titre" ></input>

        <label id="label" for="image-file" className="custom-file-upload">{labelText}</label>
        <input id="image-file" type="file" accept="image/*" style={{display: 'none'}} />

        <div className="anonym-container">
          <label for="anonym-input" className="">Send as anonym</label>
          <input id="anonym-input" type="checkbox" />
        </div>

        <div className="buttons-container">
          <p className="confirm-button" onClick={() => handlePost()}>Send Image</p>
          <p className="cancel-button" onClick={() => setPopup(!addPopup)}>Cancel</p>
        </div>
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
                <img src={image.userImg} className="user-image" />
                <a className="user-link" href={image.userUrl}>{image.username}</a>
              </div>
              <img className="image" src={image.base64} />
              <div className="likes-container">
                <Heart width="20px" height="20px" fill="#ff5023" />
                <p className="heart-desc">{image.likesNumber}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {addPopup ? <AddImage /> : null}
      <Footer />
    </div>
  )
}
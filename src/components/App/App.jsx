import React, { useState, useEffect } from 'react';
import { Container, LargeImg, SpinLoad} from './App.styled.js';
import Searchbar from 'components/Searchbar/Searchbar';
import {fetchImages} from 'services/api.js';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import SpinLoader from 'components/Loader/SpinLoader';
import {Modal} from 'components/Modal/Modal.jsx';

const reqStatus = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}


export const  App = () => {
  const [searchingImg, setSearchingImg] = useState(null);
  const [pageNum,setPageNum] = useState(1);
  const [images, setImages] = useState([]);
  const [largeImg, setLargeImg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(reqStatus.IDLE)

   useEffect(() => {
      if (!searchingImg) return

     setStatus(reqStatus.PENDING);

     fetchImages(searchingImg, pageNum).then(arrImg => {

       setImages(arrImg);

       setStatus(reqStatus.RESOLVED);

     }).catch((error) => {

       console.log(error);
       setStatus(reqStatus.REJECTED);

     });
  }, [searchingImg, pageNum]);

  const handleSubmit = searchingImages => {
    setSearchingImg(searchingImages);
    setPageNum(1);
  };

  const handleLoadMore = () => setPageNum(state => state + 1);

  const handleOnImage = (url) => {
    images.map(img => img.webformatURL.includes(url) ? setLargeImg(img.largeImageURL) : null)
    toggleShowModal();
  };

  const toggleShowModal = () => setShowModal(!showModal);

  return (
      <Container>
        <Searchbar onSubmit={handleSubmit} />
        <ImageGallery images={images} onClick={handleOnImage} />
        {reqStatus.PENDING === status && <SpinLoad><SpinLoader/></SpinLoad>}
        {reqStatus.RESOLVED === status && <SpinLoad> <Button onClick={handleLoadMore}/></SpinLoad>}
        {showModal && <Modal onClose={toggleShowModal}><LargeImg src={largeImg} /></Modal>}
      </Container>
    )
}

import React, { useState, useRef } from "react";
import { Modal, Button, Form, Image } from "react-bootstrap";

const EditProfileModal = ({ show, handleClose, user, onSave }) => {
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file)); // preview live
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    console.log("📤 PUT verso /authors/" + userId);
    console.log("📦 Dati inviati:", {
      bio: formData.get("bio"),
      avatar: formData.get("avatar"),
    });

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/authors/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        console.error("❌ Errore response:", res.status);
        throw new Error("Errore nell'aggiornamento");
      }

      const updatedUser = await res.json();
      console.log("✅ Profilo aggiornato:", updatedUser);
      onSave(); // Trigga il fetchUser nel profilo
      handleClose();
    } catch (err) {
      console.error("❌ Errore nel salvataggio:", err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Modal.Header closeButton>
          <Modal.Title>Modifica Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 text-center">
            {avatarPreview && (
              <Image
                src={avatarPreview}
                roundedCircle
                width={100}
                height={100}
                className="mb-3"
              />
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Biografia</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Scrivi qualcosa su di te..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button type="submit" variant="primary">
            Salva
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;



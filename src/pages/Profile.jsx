import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";
function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete listing?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing deleted sucessfully!");
      navigate("/profile");
    }
  };

  useEffect(() => {
    const fetchUserListing = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      let listing = [];
      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listing);
      setLoading(false);
    };
    fetchUserListing();
  }, [auth.currentUser.uid]);
  const onLogout = () => {
    auth.signOut();
    navigate("#");
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase

        await updateProfile(auth.currentUser, { displayName: name });
        //update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { name: name });
      }
    } catch (error) {
      toast.error("couldn't update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings:</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
export default Profile;

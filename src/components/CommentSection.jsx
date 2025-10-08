import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  increment,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { X, Send, Trash2 } from 'lucide-react';

const CommentSection = ({ videoId, videoAuthor, onClose }) => {
  const { currentUser } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    const commentsQuery = query(
      collection(db, 'comments'),
      where('videoId', '==', videoId),
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return unsubscribe;
  }, [videoId]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        videoId,
        uid: currentUser.uid,
        userName: currentUser.displayName,
        avatarUrl: currentUser.photoURL,
        text: comment,
        createdAt: serverTimestamp(),
      });

      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        comments: increment(1),
      });

      setComment('');
    } catch (error) {
      console.error('Erro ao postar comentário:', error);
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));

      const videoRef = doc(db, 'videos', videoId);
      await updateDoc(videoRef, {
        comments: increment(-1),
      });
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  return (
    <div className="bg-[var(--bg-color2)] h-full flex flex-col w-full border-l border-gray-700/50 md:rounded-none rounded-t-2xl">
      <div className="p-4 border-b border-gray-700/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Comentários</h2>
          {videoAuthor && (
            <p className="text-xs text-gray-400">do vídeo de @{videoAuthor}</p>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {comments.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Seja o primeiro a comentar!</p>
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-3 mb-4">
            <img
              src={
                c.avatarUrl ||
                `https://placehold.co/40x40/b554b5/FFFFFF?text=${c.userName.charAt(
                  0,
                )}`
              }
              alt={c.userName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{c.userName}</p>
              <p className="text-gray-300 text-sm break-words">{c.text}</p>
            </div>

            {currentUser && currentUser.uid === c.uid && (
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Excluir comentário"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <div ref={commentsEndRef} />
      </div>

      <form
        onSubmit={handlePostComment}
        className="p-4 border-t border-gray-700/50 bg-[var(--bg-color2)]"
      >
        <div className="relative">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="w-full pl-4 pr-12 py-3 bg-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-white"
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--primary-color)] text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:brightness-110"
            disabled={loading || !comment.trim()}
            aria-label="Enviar comentário"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;

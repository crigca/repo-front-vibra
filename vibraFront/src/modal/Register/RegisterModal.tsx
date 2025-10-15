import './RegisterModal.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpenLogin:()=>void;
}

export function RegisterModal({ isOpen, onClose,onOpenLogin }: Props) {
    if (!isOpen) return null
    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-content" onClick={e=>e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-title'>Crear cuenta</h2>
                <a className='register-subtitle' href='#' onClick={()=>{onOpenLogin(); onClose();}}>Inicia sesión si ya tienes una cuenta</a>
                <form className='register-form'>
                    <input className='register-form-input' type="text" placeholder='Usuario' required />
                    <input className='register-form-input' type="text" placeholder='Email' required />
                    <input className='register-form-input' type="password" placeholder='Contraseña' required />
                    <input className='register-form-input' type="password" placeholder='Confirmar contraseña' required />
                    <button className='register-form-submit' type="submit">Registrarse</button>
                </form>
                <div className='loginModal-lineas-container'>
                    <div className='loginModal-lineas'></div>
                    <p>O continuar con</p>
                    <div className='loginModal-lineas'></div>
                </div>
                <button>Iniciar con Google</button>
            </div>
        </div>
    );
}
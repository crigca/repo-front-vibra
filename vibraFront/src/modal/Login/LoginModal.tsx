import './LoginModal.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onOpenRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onOpenRegister}: Props) {
    if (!isOpen) return null
    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-content" onClick={e=>e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-title'>Bienvenido</h2>
                <p className='modal-subtitle'>Inicia sesión para continuar a la App</p>
                <form className='loginModal-form' onSubmit={(e) => { e.preventDefault(); /* Aquí iría la lógica de autenticación */ }}>
                    <input className='loginModal-form-input' type="text" id="username" name="username" placeholder='Usuario o Email' required />
                    <input className='loginModal-form-input' type="password" id="password" name="password" placeholder='Contraseña' required />
                    <button className='loginModal-form-submit' type="submit">Iniciar sesión</button>
                </form>
                <button className='loginModal-register-btn' onClick={()=>{onOpenRegister(); onClose();}}>Registrarse</button> {/*te lleva al modal de registro*/}
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
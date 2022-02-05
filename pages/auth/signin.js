require('next-auth/react');
import { getProviders, signIn as SignIntoProvider } from 'next-auth/react';
import Header from '../components/Header';

// running in Browser
function signIn({providers}) {
    return (
     <>

    <Header />
    <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-40 px-14 text-center' >
    <img src="/hlogo.png" className='w-80' alt="" />
    <div className='mt-30'>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className='p-5 bg-blue-600 rounded-lg text-white -mt-40 py-2' onClick={() => SignIntoProvider(provider.id,{ callbackUrl: '/'})}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
    </div>
    </>
    
    );
}

// running at serverside
export async function getServerSideProps(){
    const providers = await getProviders();

    return{
        props:{
            providers,
        },
    };
}

export default signIn

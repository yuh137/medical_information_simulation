import forge from 'node-forge';
import bcrypt from 'bcryptjs-react';

// Generate AES Key
// Client side React and React native
export const generateAesKey = () => {
  const aesSalt = forge.random.getBytesSync(32);
  const keyPassPhrase = forge.random.getBytesSync(32);
  const aesKey = forge.pkcs5.pbkdf2(
    keyPassPhrase,
    aesSalt,
    100000, // Increased iterations for stronger key derivation
    32 // Key size in bytes (256 bits)
  );
  return aesKey;
};

//Generating RSA Public and Private Keys
//Server side Node.js
//const forge = require('node-forge');//Don't need?
const BITS = 4096;
const rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: BITS}); // use according to your requirement
const publicKeyPem = forge.pki.publicKeyToPem(rsaKeyPair.publicKey);
const privateKeyPem = forge.pki.privateKeyToPem(rsaKeyPair.privateKey);
/*
// Encrypt AES Key using RSA public key
// React and React native
export const encryptAesKey = (receivedpublicKeyPem: string, aesKey: string) => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(receivedpublicKeyPem);
    const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encryptedAesKey);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error; 
  }
};

// Decrypt encrypted AES Key using RSA private key
const decryptedAesKey = rsaKeyPair.privateKey.decrypt(forge.util.decode64(encryptedAesKey), 'RSA-OAEP');

export const encryptData = (plainText, aesKey) => {
    // Step 1: Generate a random Initialization Vector (IV)
    const iv = forge.random.getBytesSync(12); // AES-GCM typically uses a 12-byte IV
  
    // Step 2: Create the cipher object
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
  
    // Step 3: Start encryption
    cipher.start({
      iv: iv, // The initialization vector
      tagLength: 128, // Optional: Auth tag length in bits (default is 128)
    });
  
    // Step 4: Update the cipher with the plaintext
    cipher.update(forge.util.createBuffer(plainText, 'utf8'));
  
    // Step 5: Finalize encryption
    cipher.finish();
  
    // Step 6: Get the encryption result
    const encrypted = cipher.output.getBytes(); // Encrypted data (ciphertext)
    const tag = cipher.mode.tag.getBytes(); // Authentication tag
  
    // Return the IV, ciphertext, and tag (Base64 encoded for storage/transmission)
    return {
      iv: forge.util.encode64(iv),
      ciphertext: forge.util.encode64(encrypted),
      tag: forge.util.encode64(tag),
    };
  };

  export const decryptData = (encryptedData, aesKey) => {
    const { iv, ciphertext, tag } = encryptedData;
  
    // Decode the Base64-encoded components
    const decodedIV = forge.util.decode64(iv);
    const decodedCiphertext = forge.util.decode64(ciphertext);
    const decodedTag = forge.util.decode64(tag);
  
    // Create the decipher object
    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
  
    // Start decryption
    decipher.start({
      iv: decodedIV, // Use the same IV as for encryption
      tag: forge.util.createBuffer(decodedTag), // Use the tag for verification
    });
  
    // Update the decipher with the ciphertext
    decipher.update(forge.util.createBuffer(decodedCiphertext));
  
    // Finalize decryption
    const success = decipher.finish();
    if (!success) {
      throw new Error('Decryption failed. Data may be tampered with or corrupted.');
    }
  
    // Return the decrypted plaintext
    return decipher.output.toString('utf8');
  };
*/

//Hashing for passwords to be secure (once done all passwords are unable to be read as hashing is 1 way)
export function passwordHasher(password) {
    //const passwordInputRef = useRef();
    //const salt = bcrypt.genSaltSync(10); //used for hashing more securely
    const saltRounds = 10 //specify the number of rounds for hashing (higher the number the more secure but also slower)
    const hashedPassword = bcrypt.hashSync(password, saltRounds);//hash the password
    return hashedPassword;
}

export function verifyPassword(password, hashedPassword) {
    const match = bcrypt.compare(password, hashedPassword);
    return match;
}